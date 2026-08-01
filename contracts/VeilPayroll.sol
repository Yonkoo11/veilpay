// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Nox, euint256, externalEuint256} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";

/// @title VeilPayroll
/// @notice Creates two-recipient payroll batches whose amounts and total remain encrypted.
/// @dev V1 deliberately separates confidential accounting from token custody. A settlement
/// adapter can move ERC-7984 balances after this accounting primitive is proven.
contract VeilPayroll is Ownable {
    struct Batch {
        address recipientA;
        address recipientB;
        euint256 allocationA;
        euint256 allocationB;
        euint256 total;
        bool totalPublished;
    }

    uint256 public nextBatchId;
    mapping(uint256 => Batch) private batches;

    error InvalidRecipient();
    error DuplicateRecipient();
    error UnknownBatch();
    error TotalAlreadyPublished();

    event BatchCreated(uint256 indexed batchId, address indexed recipientA, address indexed recipientB);
    event BatchTotalPublished(uint256 indexed batchId);

    constructor() Ownable(msg.sender) {}

    function createBatch(
        address recipientA,
        externalEuint256 encryptedAmountA,
        bytes calldata proofA,
        address recipientB,
        externalEuint256 encryptedAmountB,
        bytes calldata proofB
    ) external onlyOwner returns (uint256 batchId) {
        if (recipientA == address(0) || recipientB == address(0)) revert InvalidRecipient();
        if (recipientA == recipientB) revert DuplicateRecipient();

        euint256 amountA = Nox.fromExternal(encryptedAmountA, proofA);
        euint256 amountB = Nox.fromExternal(encryptedAmountB, proofB);
        euint256 total = Nox.add(amountA, amountB);

        Nox.allowThis(amountA);
        Nox.allowThis(amountB);
        Nox.allowThis(total);

        Nox.allow(amountA, recipientA);
        Nox.allow(amountB, recipientB);
        Nox.allow(amountA, owner());
        Nox.allow(amountB, owner());
        Nox.allow(total, owner());

        batchId = nextBatchId++;
        batches[batchId] = Batch({
            recipientA: recipientA,
            recipientB: recipientB,
            allocationA: amountA,
            allocationB: amountB,
            total: total,
            totalPublished: false
        });

        emit BatchCreated(batchId, recipientA, recipientB);
    }

    function getBatch(uint256 batchId)
        external
        view
        returns (
            address recipientA,
            address recipientB,
            euint256 allocationA,
            euint256 allocationB,
            euint256 total,
            bool totalPublished
        )
    {
        if (batchId >= nextBatchId) revert UnknownBatch();
        Batch storage batch = batches[batchId];
        return (
            batch.recipientA,
            batch.recipientB,
            batch.allocationA,
            batch.allocationB,
            batch.total,
            batch.totalPublished
        );
    }

    function canViewAllocation(uint256 batchId, address account, uint8 allocationIndex) external view returns (bool) {
        if (batchId >= nextBatchId) revert UnknownBatch();
        Batch storage batch = batches[batchId];
        if (allocationIndex == 0) return Nox.isAllowed(batch.allocationA, account);
        if (allocationIndex == 1) return Nox.isAllowed(batch.allocationB, account);
        return false;
    }

    function canViewTotal(uint256 batchId, address account) external view returns (bool) {
        if (batchId >= nextBatchId) revert UnknownBatch();
        return Nox.isAllowed(batches[batchId].total, account);
    }

    function publishTotal(uint256 batchId) external onlyOwner {
        if (batchId >= nextBatchId) revert UnknownBatch();
        Batch storage batch = batches[batchId];
        if (batch.totalPublished) revert TotalAlreadyPublished();
        batch.totalPublished = true;
        Nox.allowPublicDecryption(batch.total);
        emit BatchTotalPublished(batchId);
    }
}
