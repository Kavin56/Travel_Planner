import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { User, Calendar, MapPin, Heart, Save } from "lucide-react";

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
    const { user, profile, refreshProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        preferences: "Balanced"
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || "",
                age: profile.age || "",
                gender: profile.gender || "",
                preferences: profile.preferences || "Balanced"
            });
        }
    }, [profile, isOpen]);

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await updateDoc(doc(db, "users", user.uid), formData);
            await refreshProfile();
            toast.success("Profile updated successfully!");
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-white">
                    <div className="flex items-center space-x-4">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                            <User className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold">Manage Profile</DialogTitle>
                            <DialogDescription className="text-white/80">
                                Update your personal details and travel preferences
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-6 bg-white">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <Label className="text-gray-600 ml-1">Full Name</Label>
                            <div className="relative">
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="pl-10 h-11 bg-gray-50 border-gray-100 rounded-xl focus:ring-blue-500"
                                    placeholder="Enter your name"
                                />
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-600 ml-1">Age</Label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    className="pl-10 h-11 bg-gray-50 border-gray-100 rounded-xl focus:ring-blue-500"
                                    placeholder="e.g. 25"
                                />
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-600 ml-1">Gender</Label>
                            <Select
                                value={formData.gender}
                                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                            >
                                <SelectTrigger className="h-11 bg-gray-50 border-gray-100 rounded-xl focus:ring-blue-500">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-600 ml-1">Default Travel Mood</Label>
                        <div className="relative">
                            <Select
                                value={formData.preferences}
                                onValueChange={(value) => setFormData({ ...formData, preferences: value })}
                            >
                                <SelectTrigger className="pl-10 h-11 bg-gray-50 border-gray-100 rounded-xl focus:ring-blue-500 text-left">
                                    <SelectValue placeholder="Balanced" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Balanced">Balanced</SelectItem>
                                    <SelectItem value="Party">Party</SelectItem>
                                    <SelectItem value="Nature">Nature</SelectItem>
                                    <SelectItem value="Culture">Culture</SelectItem>
                                    <SelectItem value="Adventure">Adventure</SelectItem>
                                    <SelectItem value="Romantic">Romantic</SelectItem>
                                    <SelectItem value="Family">Family</SelectItem>
                                </SelectContent>
                            </Select>
                            <Heart className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-gray-50 border-t border-gray-100">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="rounded-xl h-11 px-6 border-gray-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="rounded-xl h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg transition-all"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Profile
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ProfileModal;
