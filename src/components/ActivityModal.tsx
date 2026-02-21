import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Trash2, Save, X, Clock, MapPin, Edit3 } from "lucide-react";
import { Activity } from "@/services/geminiService";

interface ActivityModalProps {
    activity: Activity;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (activity: Activity) => void;
    onDelete: () => void;
}

const ActivityModal = ({ activity, isOpen, onClose, onUpdate, onDelete }: ActivityModalProps) => {
    const [editedActivity, setEditedActivity] = useState<Activity>(activity);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setEditedActivity(activity);
        setIsEditing(false);
    }, [activity]);

    const handleRating = (rating: number) => {
        const updated = { ...editedActivity, rating };
        setEditedActivity(updated);
        if (!isEditing) onUpdate(updated);
    };

    const handleSave = () => {
        onUpdate(editedActivity);
        setIsEditing(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl w-[90vw] h-[80vh] flex flex-col bg-white p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
                <DialogHeader className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white flex-shrink-0">
                    <DialogTitle className="text-xl font-bold flex items-center">
                        <Clock className="mr-2 h-5 w-5" />
                        {activity.time} - Activity Details
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {isEditing ? (
                        <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">Activity Name</Label>
                                    <Input
                                        value={editedActivity.activity}
                                        onChange={(e) => setEditedActivity({ ...editedActivity, activity: e.target.value })}
                                        className="h-12 border-2 focus:border-orange-500 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">Time</Label>
                                    <Input
                                        value={editedActivity.time}
                                        onChange={(e) => setEditedActivity({ ...editedActivity, time: e.target.value })}
                                        className="h-12 border-2 focus:border-orange-500 rounded-xl"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 h-5 w-5" />
                                    <Input
                                        value={editedActivity.location || ""}
                                        onChange={(e) => setEditedActivity({ ...editedActivity, location: e.target.value })}
                                        className="h-12 border-2 focus:border-orange-500 rounded-xl pl-12"
                                        placeholder="Enter location"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700">Description</Label>
                                <Textarea
                                    value={editedActivity.description}
                                    onChange={(e) => setEditedActivity({ ...editedActivity, description: e.target.value })}
                                    className="border-2 focus:border-orange-500 rounded-xl min-h-[150px] text-base p-4"
                                    rows={6}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fade-in space-y-8">
                            <div className="max-w-2xl mx-auto space-y-6">
                                <h3 className="text-xl font-extrabold text-gray-900 leading-tight tracking-tight">{activity.activity}</h3>
                                <p className="text-gray-600 text-base leading-relaxed font-medium">{activity.description}</p>

                                {activity.location && (
                                    <div className="flex items-center text-orange-700 bg-orange-50 p-4 rounded-2xl border border-orange-100 shadow-sm transition-all hover:shadow-md">
                                        <MapPin className="mr-3 h-5 w-5 text-orange-600 animate-bounce" />
                                        <span className="text-base font-semibold">{activity.location}</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                                    {/* Rating Section */}
                                    <div className="space-y-4">
                                        <Label className="text-sm font-bold text-gray-500 uppercase tracking-widest block">Your Rating</Label>
                                        <div className="flex space-x-3">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => handleRating(star)}
                                                    className="transition-all duration-300 transform hover:scale-125 focus:outline-none"
                                                >
                                                    <Star
                                                        className={`h-8 w-8 ${star <= (editedActivity.rating || 0)
                                                            ? "text-yellow-400 fill-yellow-400 drop-shadow-md"
                                                            : "text-gray-200"
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Review Section */}
                                    <div className="space-y-4">
                                        <Label className="text-sm font-bold text-gray-500 uppercase tracking-widest block">Your Review</Label>
                                        <Textarea
                                            placeholder="Share your experience..."
                                            value={editedActivity.review || ""}
                                            onChange={(e) => {
                                                const updated = { ...editedActivity, review: e.target.value };
                                                setEditedActivity(updated);
                                                onUpdate(updated);
                                            }}
                                            className="border-2 border-gray-100 focus:border-orange-500 rounded-2xl resize-none p-4 text-gray-700 leading-relaxed min-h-[120px]"
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 bg-gray-50/80 backdrop-blur-sm border-t border-gray-100 flex-shrink-0 gap-3 sm:flex-row">
                    {isEditing ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                                className="rounded-xl border-2 h-12 px-6 font-semibold"
                            >
                                Cancel Edit
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all h-12 px-8 font-bold flex-1 sm:flex-none"
                            >
                                <Save className="mr-2 h-5 w-5" />
                                Save Changes
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="destructive"
                                onClick={onDelete}
                                className="rounded-xl shadow-md hover:shadow-xl transition-all h-12 px-6 font-semibold hover:scale-[1.02]"
                            >
                                <Trash2 className="mr-2 h-5 w-5" />
                                Cancel from Plan
                            </Button>
                            <div className="flex-1 hidden sm:block" />
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(true)}
                                className="rounded-xl border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-all h-12 px-8 font-bold hover:scale-[1.02]"
                            >
                                <Edit3 className="mr-2 h-5 w-5" />
                                Modify Plan
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ActivityModal;
