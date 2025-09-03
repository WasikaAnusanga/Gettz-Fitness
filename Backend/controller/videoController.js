
import Video from "../model/Video_Portal.js";


export async function uploadVideo(req, res) {
  try {
    // auth
    if (!req.user) {
      return res
        .status(403)
        .json({ message: "You need logging first to upload video" });
    }
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not allowed to upload Video" });
    }


    const {
      title,
      description,
      altNames = [],
      tags = [],
      duration,
      videoUrl,
      isPublished = true,
    } = req.body;

    if (!title || !description || duration == null || !videoUrl) {
      return res.status(400).json({
        message:
          "Missing required fields (title, description, duration, videoUrl)",
      });
    }

 
    const toArray = (v) =>
      Array.isArray(v)
        ? v
        : String(v)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

    const doc = await Video.create({
      title: String(title).trim(),
      description: String(description).trim(),
      altNames: toArray(altNames),
      tags: toArray(tags),
      duration: Number(duration),
      videoUrl,
      isPublished: Boolean(isPublished),
      uploadedBy: req.user.id || req.user._id,
    });

    return res.status(201).json({
      message: "Video Upload Successfully",
      video: doc,
    });
  } catch (err) {
    if (err?.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: err.errors });
    }
    console.error("uploadVideo error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export async function getAllvideo(req, res) {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error("getAllvideo error:", err);
    res.status(500).json({ message: "Error fetching videos" });
  }
}

export async function updateVideo(req, res) {
  try {
    const { videoId } = req.params;
    const updated = await Video.findOneAndUpdate({ videoId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.json({ message: "Video Updated Successfully", video: updated });
  } catch (err) {
    if (err?.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: err.errors });
    }
    console.error("updateVideo error:", err);
    res.status(500).json({ message: "Error updating video" });
  }
}


export async function deleteVideo(req, res) {
  try {
    if (!req.user) {
      return res
        .status(403)
        .json({ message: "You need logging first to delete a video" });
    }
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete a video" });
    }

    const { videoId } = req.params;
    const deleted = await Video.findOneAndDelete({ videoId });

    if (!deleted) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("deleteVideo error:", err);
    res.status(500).json({ message: "Error deleting video" });
  }
}


export async function getVideoById(req, res) {
  try {
    const { id: videoId } = req.params;
    const video = await Video.findOne({ videoId });

    if (!video) {
      return res.status(404).json({ message: "Video Not Found" });
    }
    res.json({ video });
  } catch (err) {
    console.error("getVideoById error:", err);
    res.status(500).json({ message: "Error fetching video" });
  }
}
