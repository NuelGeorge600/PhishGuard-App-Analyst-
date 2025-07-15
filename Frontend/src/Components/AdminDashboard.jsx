import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [payments, setPayments] = useState([]);
  const { isAdmin } = useContext(AuthContext);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      const [logsRes, paymentsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/admin/logs`),
        axios.get(`${process.env.REACT_APP_API_URL}/admin/payments`)
      ]);
      setLogs(logsRes.data);
      setPayments(paymentsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  if (!isAdmin) {
    return <div className="admin-error">Access Denied: Admin privileges required</div>;
  }

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      
      <div className="section">
        <h3>Activity Logs</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Action</th>
              <th>IP</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.action}</td>
                <td>{log.ip_address}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="section">
        <h3>Payment Records</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount (₦)</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.amount}</td>
                <td>{payment.status}</td>
                <td>{new Date(payment.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
