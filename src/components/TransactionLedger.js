import React, { useState, useEffect } from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { ethers } from 'ethers';

const TransactionLedger = ({ provider, crowdsale, account, darkMode }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!provider || !crowdsale || !account) return;

      try {
        // Get Buy events from the contract
        const buyFilter = crowdsale.filters.Buy();
        const buyEvents = await crowdsale.queryFilter(buyFilter);

        // Format the events for display
        const formattedTransactions = await Promise.all(buyEvents.map(async (event) => {
          const block = await event.getBlock();
          const timestamp = new Date(block.timestamp * 1000).toLocaleString();
          
          return {
            txHash: event.transactionHash,
            from: event.args[1],
            amount: ethers.utils.formatUnits(event.args[0], 18),
            timestamp: timestamp,
            type: 'Buy'
          };
        }));

        // Sort by timestamp (newest first)
        formattedTransactions.sort((a, b) => {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });

        setTransactions(formattedTransactions);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      }
    };

    fetchTransactions();
  }, [provider, crowdsale, account]);

  return (
    <Card className="my-4" bg={darkMode ? "dark" : "light"} text={darkMode ? "white" : "dark"}>
      <Card.Header className={darkMode ? "border-secondary" : ""}>
        Transaction Ledger
      </Card.Header>
      <Card.Body>
        {transactions.length > 0 ? (
          <Table striped bordered hover responsive variant={darkMode ? "dark" : "light"}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>From</th>
                <th>Amount</th>
                <th>Transaction</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index}>
                  <td>{tx.timestamp}</td>
                  <td>
                    <Badge bg="success">
                      {tx.type}
                    </Badge>
                  </td>
                  <td>
                    <small>{tx.from.slice(0, 6)}.....{tx.from.slice(-4)}</small>
                    {tx.from.toLowerCase() === account?.toLowerCase() && (
                      <Badge bg="info" className="ms-2">You</Badge>
                    )}
                  </td>
                  <td>{tx.amount} DAPPU</td>
                  <td>
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${tx.txHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={darkMode ? "text-info" : "text-primary"}
                    >
                      {tx.txHash.slice(0, 5)}.....{tx.txHash.slice(-5)}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center">No transactions found.</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default TransactionLedger;