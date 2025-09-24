import React, { useState, useEffect } from 'react';
import axios from 'axios';
// JSON 문자열을 예쁘게 포맷팅하기 위한 유틸리티 함수 (별도 파일에 존재한다고 가정)
import { formatJson } from '../utils/jsonUtils';

/**
 * API 서버의 로그를 조회하고 테이블 형태로 보여주는 리액트 컴포넌트입니다.
 * 컴포넌트 마운트 시 자동으로 로그를 불러오며, 로딩 및 에러 상태를 처리합니다.
 * '새로고침' 버튼을 통해 수동으로 데이터를 다시 불러올 수 있습니다.
 */
const LogViewer = () => {
  // --- State 관리 ---
  const [logs, setLogs] = useState([]); // 서버로부터 받아온 로그 데이터 배열을 저장하는 상태
  const [loading, setLoading] = useState(true); // API 호출이 진행 중인지 여부를 나타내는 상태 (로딩 UI 표시용)
  const [error, setError] = useState(null); // API 호출 중 오류 발생 시 에러 메시지를 저장하는 상태

  /**
   * API 서버로부터 로그 데이터를 비동기적으로 가져오는 함수입니다.
   */
  const fetchLogs = async () => {
    try {
      setLoading(true); // 데이터 요청 시작 시 로딩 상태를 true로 설정
      const response = await axios.get('http://localhost:8083/api/logs');
      setLogs(response.data); // 성공적으로 데이터를 받아오면 logs 상태를 업데이트
      setError(null); // 이전의 에러 상태를 초기화
    } catch (err) {
      setError('로그를 불러오는 데 실패했습니다.'); // 오류 발생 시 에러 상태를 업데이트
      console.error('API 호출 오류:', err); // 개발자 확인을 위해 콘솔에 상세 에러 출력
    } finally {
      setLoading(false); // 요청 성공/실패 여부와 관계없이 로딩 상태를 false로 설정
    }
  };

  // --- Effect Hook ---
  // 컴포넌트가 처음 화면에 렌더링(마운트)될 때 한 번만 fetchLogs 함수를 호출합니다.
  // 두 번째 인자인 의존성 배열 `[]`이 비어있기 때문에, 최초 1회만 실행됩니다.
  useEffect(() => {
    fetchLogs();
  }, []);

  // 상태 코드에 따라 행과 점의 스타일을 반환하는 함수
    const getStatusStyles = (status) => {
        if (status >= 500) return { row: 'bg-red-50', dot: 'bg-red-500' }; // 서버 에러
        if (status >= 400) return { row: 'bg-yellow-50', dot: 'bg-yellow-500' }; // 클라이언트 에러
        if (status >= 300) return { row: 'bg-blue-50', dot: 'bg-blue-500' }; // 리다이렉션
        return { row: 'hover:bg-gray-50', dot: 'bg-green-500' }; // 성공
    };

  // --- 조건부 렌더링 ---
  // 로딩 중일 때 표시할 UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">로그를 불러오는 중...</div>
      </div>
    );
  }

  // 에러가 발생했을 때 표시할 UI
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-red-500">오류: {error}</div>
      </div>
    );
  }

  // --- 메인 UI 렌더링 ---
  // 로딩과 에러가 없을 때 실제 로그 테이블을 렌더링합니다.
  return (
        <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-full mx-auto bg-white rounded-lg shadow-md">
                <div className="p-4 border-b flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">API Event Logs</h1>
                    <div className="flex items-center space-x-4">
                        <input type="text" placeholder="Search..." className="px-2 py-1 border rounded-md text-sm" />
                        <button onClick={fetchLogs} className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold rounded-md transition">
                            Update list
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        {/* 테이블 헤더 스타일 변경 */}
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">ID</th>
                                <th className="px-4 py-2 text-left font-semibold">Service</th>
                                <th className="px-4 py-2 text-left font-semibold">Endpoint</th>
                                <th className="px-4 py-2 text-left font-semibold">Method</th>
                                <th className="px-4 py-2 text-left font-semibold">Status</th>
                                <th className="px-4 py-2 text-left font-semibold">Timestamp</th>
                                <th className="px-4 py-2 text-left font-semibold">Client IP</th>
                                <th className="px-4 py-2 text-left font-semibold">Request</th>
                                <th className="px-4 py-2 text-left font-semibold">Response</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {logs.map((log) => {
                                // 현재 로그의 상태에 맞는 스타일 클래스를 가져옵니다.
                                const styles = getStatusStyles(log.responseStatus);
                                return (
                                    // 행(tr)에 동적으로 클래스를 적용합니다.
                                    <tr key={log.logId} className={styles.row}>
                                        <td className="px-4 py-2 whitespace-nowrap">{log.logId}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{log.serviceName}</td>
                                        <td className="px-4 py-2 truncate max-w-xs">{log.apiEndpoint}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{log.httpMethod}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {/* 상태 코드 앞에 색상 점을 추가하여 시각화 */}
                                            <div className="flex items-center">
                                                <span className={`h-2.5 w-2.5 rounded-full mr-2 ${styles.dot}`}></span>
                                                {log.responseStatus}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{log.clientIp}</td>
                                        <td className="px-4 py-2">
                                            {log.requestPayload ? (
                                                <pre className="text-xs font-mono bg-gray-100 p-1 rounded max-h-24 overflow-auto">{formatJson(log.requestPayload)}</pre>
                                            ) : (<span>-</span>)}
                                        </td>
                                        <td className="px-4 py-2">
                                            {log.responsePayload ? (
                                                <pre className="text-xs font-mono bg-gray-100 p-1 rounded max-h-24 overflow-auto">{formatJson(log.responsePayload)}</pre>
                                            ) : (<span>-</span>)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LogViewer;