import { useState, type FormEvent } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword) {
            toast.error("Todos los campos son obligatorios.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden.");
            return;
        }

        if (!email.endsWith("@oxygenworkspace.com")) {
            toast.error("Correo no permitido. Usa un email de oxygenworkspace.com");
            return;
        }

        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCred.user);
            toast.success("Registro exitoso. Revisa tu correo para verificar tu cuenta.", {
                onClose: () => navigate("/login"),
                autoClose: 4000, //Se cierra en 4s
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Error: " + error.message);
            } else {
                toast.error("Error desconocido.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleRegister}
                className="bg-white p-8 rounded-[10px] shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>

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
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md"
                    required
                />

                <input
                    type="password"
                    placeholder="Repite la contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 mb-6 border border-gray-300 rounded-md"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
                >
                    Registrarse
                </button>
            </form>
        </div>
    );
}

export default Register;
