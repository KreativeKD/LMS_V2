import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null, 
            errorInfo: null 
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error Boundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({ 
            hasError: false, 
            error: null, 
            errorInfo: null 
        });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '2rem'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '3rem',
                        maxWidth: '600px',
                        textAlign: 'center',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{
                            fontSize: '4rem',
                            marginBottom: '1rem'
                        }}>⚠️</div>
                        
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: '#1F2937',
                            marginBottom: '1rem'
                        }}>
                            Oops! Something went wrong
                        </h1>
                        
                        <p style={{
                            color: '#6B7280',
                            marginBottom: '2rem',
                            fontSize: '1.1rem'
                        }}>
                            We're sorry for the inconvenience. The application encountered an unexpected error.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div style={{
                                background: '#FEE2E2',
                                border: '1px solid #FCA5A5',
                                borderRadius: '8px',
                                padding: '1rem',
                                marginBottom: '2rem',
                                textAlign: 'left',
                                maxHeight: '200px',
                                overflow: 'auto'
                            }}>
                                <p style={{
                                    fontWeight: 'bold',
                                    color: '#991B1B',
                                    marginBottom: '0.5rem'
                                }}>
                                    Error Details:
                                </p>
                                <code style={{
                                    fontSize: '0.875rem',
                                    color: '#7F1D1D',
                                    display: 'block',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word'
                                }}>
                                    {this.state.error.toString()}
                                </code>
                            </div>
                        )}

                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center'
                        }}>
                            <button
                                onClick={this.handleReset}
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    padding: '0.75rem 2rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                Return to Home
                            </button>
                            
                            <button
                                onClick={() => window.location.reload()}
                                style={{
                                    background: '#E5E7EB',
                                    color: '#374151',
                                    padding: '0.75rem 2rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
