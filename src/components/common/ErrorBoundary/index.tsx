import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    message?: string;
}

class ErrorBoundaryComponent extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, message: error.message };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, info);
    }

    handleReset = () => {
        this.setState({ hasError: false, message: undefined });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-background p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                                <AlertTriangle className="h-8 w-8" />
                            </div>
                            <CardTitle className="text-2xl">Щось пішло не так</CardTitle>
                            <CardDescription>
                                Виникла несподівана помилка. Спробуйте оновити сторінку.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {this.state.message && (
                                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                                    <p className="text-xs font-medium text-destructive">
                                        Деталі помилки:
                                    </p>
                                    <pre className="mt-2 overflow-auto text-xs text-muted-foreground">
                                        {this.state.message}
                                    </pre>
                                </div>
                            )}
                            <Button onClick={this.handleReset} className="w-full gap-2" size="lg">
                                <RefreshCw className="h-4 w-4" />
                                Оновити сторінку
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export const ErrorBoundary = ErrorBoundaryComponent;
