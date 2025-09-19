import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LogViewer.css';

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:8083/api/logs');
        setLogs(response.data);
      } catch (err) {
        setError('로그를 불러오는 데 실패했습니다.');
        console.error('API 호출 오류:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <div>로그를 불러오는 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <div className="log-container">
      <h1>API 로그 뷰어</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>서비스</th>
            <th>API 엔드포인트</th>
            <th>HTTP 메소드</th>
            <th>응답 상태</th>
            <th>기록 시각</th>
            <th>클라이언트 IP</th>
            <th>요청 페이로드</th>
            <th>응답 페이로드</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.logId}>
              <td>{log.logId}</td>
              <td>{log.serviceName}</td>
              <td>{log.apiEndpoint}</td>
              <td>{log.httpMethod}</td>
              <td>{log.responseStatus}</td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
              <td>{log.clientIp}</td>
              <td>{log.requestPayload}</td>
              <td>{log.responsePayload}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogViewer;