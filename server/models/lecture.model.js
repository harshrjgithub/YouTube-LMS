import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
    lectureTitle: {
        type: String,
        required: true,
    },
    lectureDescription: {
        type: String,
        default: '',
    },
    videoUrl: {
        type: String,
        default: null,
    },
    youtubeVideoId: {
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
    sequence: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

export const Lecture = mongoose.model('Lecture', lectureSchema);