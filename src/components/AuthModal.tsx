import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, db } from "@/lib/firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import { ShieldCheck, Mail, Lock, UserPlus, LogIn, Chrome } from "lucide-react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultMode?: "login" | "signup";
}

const AuthModal = ({ isOpen, onClose, defaultMode = "login" }: AuthModalProps) => {
    const [mode, setMode] = useState<"login" | "signup">(defaultMode);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === "signup") {
                const result = await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, "users", result.user.uid), {
                    name,
                    email,
                    createdAt: new Date().toISOString(),
                    preferences: "Balanced"
                });
                toast.success("Account created successfully!");
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success("Welcome back!");
            }
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    name: user.displayName || "",
                    email: user.email || "",
                    createdAt: new Date().toISOString(),
                    preferences: "Balanced"
                });
            }
            toast.success("Signed in with Google!");
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Google sign-in failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px] rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 text-white text-center">
                    <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                    <DialogTitle className="text-2xl font-bold mb-2">
                        {mode === "login" ? "Welcome Back" : "Create Account"}
                    </DialogTitle>
                    <DialogDescription className="text-white/80">
                        {mode === "login"
                            ? "Sign in to access your saved itineraries"
                            : "Join us and start planning your dream trips"}
                    </DialogDescription>
                </div>

                <div className="p-8 space-y-6 bg-white">
                    <form onSubmit={handleAuth} className="space-y-4">
                        {mode === "signup" && (
                            <div className="space-y-2">
                                <Label className="text-gray-600 ml-1">Full Name</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-10 h-12 bg-gray-50 border-gray-100 rounded-xl focus:ring-orange-500"
                                        required
                                    />
                                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label className="text-gray-600 ml-1">Email Address</Label>
                            <div className="relative">
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 h-12 bg-gray-50 border-gray-100 rounded-xl focus:ring-orange-500"
                                    required
                                />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-600 ml-1">Password</Label>
                            <div className="relative">
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 h-12 bg-gray-50 border-gray-100 rounded-xl focus:ring-orange-500"
                                    required
                                />
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {mode === "login" && (
                            <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 mb-4">
                                <p className="text-xs text-orange-800 font-medium">
                                    <span className="font-bold">Test Login:</span> test@gmail.com / test123
                                </p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl font-bold shadow-lg transition-all"
                            disabled={loading}
                        >
                            {loading ? "Please wait..." : (mode === "login" ? "Sign In" : "Sign Up")}
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 text-gray-400 font-medium">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full h-12 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                    >
                        <Chrome className="mr-2 h-5 w-5 text-red-500" />
                        Sign in with Google
                    </Button>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button
                            onClick={() => setMode(mode === "login" ? "signup" : "login")}
                            className="text-orange-600 font-bold hover:underline"
                        >
                            {mode === "login" ? "Sign Up" : "Sign In"}
                        </button>
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;
