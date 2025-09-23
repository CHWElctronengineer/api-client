import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatJson } from '../utils/jsonUtils';

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true); // Start loading state
      const response = await axios.get('http://localhost:8083/api/logs');
      setLogs(response.data);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError('로그를 불러오는 데 실패했습니다.');
      console.error('API 호출 오류:', err);
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Use useEffect to call fetchLogs only once when the component mounts.
  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">로그를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-red-500">오류: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">API 로그 뷰어</h1>
          <button
            onClick={fetchLogs}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            새로고침
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="w-10 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                <th className="w-24 md:w-28 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">서비스</th>
                <th className="w-48 md:w-64 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">API 엔드포인트</th>
                <th className="w-20 md:w-24 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">메소드</th>
                <th className="w-20 md:w-24 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">상태</th>
                <th className="w-32 md:w-40 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">기록 시각</th>
                <th className="w-24 md:w-28 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">클라이언트 IP</th>
                <th className="w-48 md:w-72 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">요청 페이로드</th>
                <th className="w-48 md:w-72 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">응답 페이로드</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm md:text-base">
              {logs.map((log) => (
                <tr key={log.logId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis">{log.logId}</td>
                  <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis">{log.serviceName}</td>
                  <td className="px-4 py-3 truncate">{log.apiEndpoint}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{log.httpMethod}</td>
                  <td className="px-4 py-3 text-center">{log.responseStatus}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis">{log.clientIp}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 overflow-hidden break-words">
                {log.requestPayload ? (
                  <pre className="max-h-36 overflow-y-auto bg-gray-100 p-2 rounded-md font-mono text-xs break-words">{formatJson(log.requestPayload)}</pre>
                ) : (
                  <span>-</span> // Display a placeholder like a dash
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 overflow-hidden break-words">
                {log.responsePayload ? (
                  <pre className="max-h-36 overflow-y-auto bg-gray-100 p-2 rounded-md font-mono text-xs break-words">{formatJson(log.responsePayload)}</pre>
                ) : (
                  <span>-</span> // Display a placeholder
                )}
              </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LogViewer;