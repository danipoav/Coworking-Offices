import { useState, type FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            toast.success('Bienvenido ' + userCred.user.email)
            navigate("/home");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Error al iniciar sesión: " + error.message);
            } else {
                toast.error("Error desconocido.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-[10px] shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>

                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md"
                    required
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-6 border border-gray-300 rounded-md"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
                >
                    Entrar
                </button>

                <p className="text-center mt-4 text-sm">
                    ¿No tienes una cuenta?{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Regístrate aquí
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
