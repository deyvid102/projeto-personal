import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-x1 shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6">
                    AthletIQ
                </h1>

                <form 
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        onLogin();
                        navigate("/");
                    }}
                >
                    <input
                        type="email"
                        placeholder="E-mail"
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}