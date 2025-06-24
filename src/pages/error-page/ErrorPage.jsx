import { Component } from "react";
import { useSendErrorReportMutation } from "./api/api"; // Импортируем хук из RTK Query

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isSent: false,
    };
  }

  // eslint-disable-next-line no-unused-vars
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleSendReport = async () => {
    if (this.state.isSent) return;
  
    const storedUser = JSON.parse(localStorage.getItem("user")); // Замените "auth" на реальный ключ
    const userId = storedUser?.userId || "Неизвестный пользователь";
  
    const errorReport = {
      message: this.state.error?.toString() || " ",
      stack: this.state.errorInfo?.componentStack || "Нет данных",
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      userId, // Добавляем userId в отчёт
    };
  
    console.log("Отправка отчета об ошибке:", errorReport);
  
    try {
      await this.props.sendErrorReport(errorReport);
  
      this.setState({ isSent: true });
      alert("Отчет об ошибке отправлен!");
    } catch (err) {
      console.error("Ошибка при отправке отчета:", err);
      alert("Не удалось отправить отчет. Попробуйте позже.");
    }
  };  

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-3xl">Что-то пошло не так 😢</h1>
            <p className="mt-2 text-lg text-supporting">
              Пожалуйста, не используйте какие либо расширения при работе с данным сайтом (например для автоперевода).
              <br />А также отправьте отчёт об ошибке, это позволит нам решить
              её гораздо быстрее!
            </p>

            <button
              onClick={this.handleSendReport}
              disabled={this.state.isSent}
              className={`mt-4 rounded-md px-4 py-2 text-lg ${
                this.state.isSent ? "bg-dark-supporting" : "bg-red-700"
              }`}
            >
              {this.state.isSent ? "Отчет отправлен" : "Отправить отчет"}
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// HOC для подключения RTK Query
const ErrorBoundaryWithAPI = (props) => {
  const [sendErrorReport] = useSendErrorReportMutation();
  return <ErrorBoundary {...props} sendErrorReport={sendErrorReport} />;
};

export default ErrorBoundaryWithAPI;
