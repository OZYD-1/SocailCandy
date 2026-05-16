import User from "../models/User.js";

// Read
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found. " });
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found. " });
    const friends = await Promise.all(
      user.friends.map((friendId) => User.findById(friendId)),
    );
    const formattedFriends = friends
      .filter((friend) => friend !== null)
      .map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return { _id, firstName, lastName, occupation, location, picturePath };
        },
      );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* SEARCH USERS */
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === "") {
      return res.status(200).json([]);
    }
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { occupation: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
      ],
    }).select("-password").limit(10);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE PROFILE */
export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    // Only allow updating safe fields
    const { firstName, lastName, location, occupation, socialLinks, picturePath } = req.body;
    const updates = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (location !== undefined) updates.location = location;
    if (occupation !== undefined) updates.occupation = occupation;
    if (picturePath !== undefined) updates.picturePath = picturePath;
    if (socialLinks !== undefined) updates.socialLinks = socialLinks;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, select: "-password" }
    );
    if (!user) return res.status(404).json({ msg: "User not found." });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* FRIEND REQUESTS */
export const sendFriendRequest = async (req, res) => {
  try {
    const { id, targetId } = req.params; // id = sender, targetId = receiver
    const sender = await User.findById(id).select("-password");
    const target = await User.findById(targetId);
    if (!sender || !target) return res.status(404).json({ msg: "User not found." });

    // Don't add if already friends or request already sent
    const alreadyFriends = target.friends.includes(String(id));
    const alreadyRequested = target.friendRequests.some(r => String(r.fromId) === String(id));
    if (alreadyFriends) return res.status(400).json({ msg: "Already friends." });
    if (alreadyRequested) return res.status(400).json({ msg: "Request already sent." });

    target.friendRequests.push({
      fromId: String(id),
      fromName: `${sender.firstName} ${sender.lastName}`,
      fromPicture: sender.picturePath,
      seen: false,
    });
    await target.save();
    res.status(200).json({ msg: "Friend request sent." });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("friendRequests");
    if (!user) return res.status(404).json({ msg: "User not found." });
    res.status(200).json(user.friendRequests);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const markNotificationsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, {
      $set: { "friendRequests.$[].seen": true }
    });
    res.status(200).json({ msg: "Marked as seen." });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { id, fromId } = req.params; // id = current user, fromId = requester
    const user = await User.findById(id);
    const requester = await User.findById(fromId);
    if (!user || !requester) return res.status(404).json({ msg: "User not found." });

    // Add as friends
    if (!user.friends.includes(fromId)) user.friends.push(fromId);
    if (!requester.friends.includes(id)) requester.friends.push(id);

    // Remove the request
    user.friendRequests = user.friendRequests.filter(r => String(r.fromId) !== String(fromId));
    await user.save();
    await requester.save();
    res.status(200).json({ msg: "Friend request accepted." });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const declineFriendRequest = async (req, res) => {
  try {
    const { id, fromId } = req.params;
    await User.findByIdAndUpdate(id, {
      $pull: { friendRequests: { fromId: String(fromId) } }
    });
    res.status(200).json({ msg: "Friend request declined." });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update - Add/Remove Friend
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    if (!user || !friend)
      return res.status(404).json({ msg: "User not found. " });
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((uid) => uid !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id)),
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      },
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};