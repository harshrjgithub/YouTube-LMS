import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
    lectureTitle: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        default: null,
    },
    publicID: {
        type: String,
        default: null,
    },
    isPreview: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export const Lecture = mongoose.model('Lecture', lectureSchema);