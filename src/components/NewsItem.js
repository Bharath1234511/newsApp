import React, { useState } from 'react';
import { FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

export default function NewsItem(props) {
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');

  const handleReadMore = async (e) => {
    e.preventDefault();
    setShowSummary(true);
    setLoadingSummary(true);
    setSummary('');
    setErrorDetails('');
    
    try {
      const response = await fetch('https://newsappbackendproxy.onrender.com/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: props.newsUrl }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      setSummary(data.summary || 'Summary not available');
    } catch (error) {
      console.error('Request error:', error);
      setSummary(`Error: ${error.message}`);
      setErrorDetails('The AI summarization service is currently unavailable. This could be due to high demand or maintenance. Please try again later or read the full article for details.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const closeSummary = () => setShowSummary(false);

  return (
    <>
      <div className='my-3'>
        <div className="card h-100 shadow-sm border-0">
          <div className="card-img-container" style={{ height: '200px', overflow: 'hidden' }}>
            <img 
              src={props.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image'}
              className="card-img-top h-100 object-fit-cover"
              alt={props.title || "News image"} 
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Available';
              }}
            />
          </div>
          <div className="card-body">
            <h5 className="card-title fw-bold">{props.title || "No Title"}</h5>
            <p className="card-text text-muted">{props.description ? `${props.description.slice(0, 88)}...` : "No description available"}</p>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <small className="text-body-secondary">
                <span className="d-block">By {props.author || "Unknown"}</span>
                <span>{new Date(props.date).toLocaleDateString()}</span>
              </small>
              <button 
                onClick={handleReadMore} 
                className="btn btn-sm btn-dark rounded-pill px-3"
              >
                Summary
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Modal */}
      {showSummary && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">Article Summary</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={closeSummary}
                ></button>
              </div>
              <div className="modal-body p-4">
                {loadingSummary ? (
                  <div className="text-center py-4">
                    <div className="spinner-grow text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <h5 className="mt-3">Generating AI Summary</h5>
                    <div className="progress mt-3" style={{ height: '6px' }}>
                      <div 
                        className="progress-bar progress-bar-striped progress-bar-animated" 
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                    <p className="text-muted mt-3 mb-0">
                      Analyzing article content... This usually takes 10-30 seconds
                    </p>
                  </div>
                ) : (
                  <div className="summary-content">
                    {summary.startsWith('Error:') ? (
                      <div className="alert alert-danger rounded">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0">
                            <div className="bg-danger rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                              </svg>
                            </div>
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <h5 className="mb-1">{summary}</h5>
                            <p className="mb-0">{errorDetails}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-light rounded p-3 mb-3">
                          <h6 className="d-flex align-items-center mb-3">
                            <span className="badge bg-primary me-2">AI Summary</span>
                            <small className="text-muted ms-auto">Powered by Hugging Face</small>
                          </h6>
                          <p className="summary-text mb-0">
                            {summary}
                          </p>
                        </div>
                        <div className="alert alert-info rounded">
                          <div className="d-flex">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-info me-2 flex-shrink-0" viewBox="0 0 16 16">
                              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                            </svg>
                            <div>
                              <small>
                                This AI-generated summary may contain inaccuracies. For full context, 
                                please read the original article. The summary is provided for quick 
                                reference only.
                              </small>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="modal-footer bg-light">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary rounded-pill px-4" 
                  onClick={closeSummary}
                >
                  Close
                </button>
                <a 
                  href={props.newsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary rounded-pill px-4 d-flex align-items-center"
                >
                  View Full Article <FaExternalLinkAlt className="ms-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .modal-content {
          border-radius: 12px;
          overflow: hidden;
        }
        .modal-header {
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .modal-footer {
          border-top: 1px solid #eee;
        }
        .summary-text {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #444;
        }
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 10px;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .card-img-container {
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          overflow: hidden;
        }
        .progress-bar {
          transition: width 0.5s ease;
        }
        .badge {
          font-weight: 500;
          letter-spacing: 0.5px;
        }
      `}</style>
    </>
  );
}