// import Notification from '../model/notification.js'; 
// import UserNotification from '../model/userNotification.js';
// import { io } from '../index.js';
// import User from '../model/user.js';

// export function viewNotifications(req, res){

//         Notification.find().then(
//             (notifi) => {
//                 res.json(notifi)
//             }
//         ).catch(
//             (error) => {
//                 console.log(error)
//                 res.status(500).json({
//                     message : "Notification loading failed"
//                 })
//             }
//         )
// }

// export async function createPromotionalNotification(req, res){

//     // if(req.user == null){
//     //     res.status(403).json({
//     //         message: "Please login to create promotional announcement"
//     //     });
//     //     return;
//     // }

//     // if(req.user.role != "admin"){
//     //     res.status(403).json({
//     //         message: "Login as an admin to create promotional announcement"
//     //     });
//     //     return;
//     // }

//     try {

//         const { title, body, type = 'promotional' } = req.body;

//         if (!title || !body) {
//             res.status(400).json({ 
//                 message: 'Please provide title and body.' 
//             });
//             return
//         }

//         const notification = new Notification({
//             title,
//             body,
//             type,
//             status: 'sent',
//             deliveryTo: 'all_members',
//             sentDate: new Date(),
//             createdBy: req.user.adminId
//         });

//         await notification.save();

//         const members = await User.find({ role: 'member' });

//         for (const member of members) {
//             const userNotification = new UserNotification({
//                 NIC: notification._id,
//                 user_id: member._id
//             });

//             await userNotification.save();

//             io.to(member._id.toString()).emit('newNotification', {
//                 title: notification.title,
//                 body: notification.body,
//                 type: notification.type,
//                 timestamp: notification.sentDate
//             });

//         }

//         res.status(201).json({ message: 'Notification created and sent to all members successfully', notification });

//     } catch (error) {

//         console.error('Error creating notification for all members:', error);
//         res.status(500).json({ message: 'Internal server error.', error: error.message });

//     }
// }

// export function updateNotification(req,res){

//     Notification.findOneAndUpdate({_id : req.params.id}, req.body).then(
//         (notifi) => {
//             res.json({
//                 message : "Notification Updated Successfully",
//                 notifi
//             })
//         }
//     ).catch(
//         console.log("Notification Udate Failed")
//     )

// }

// export function deleteNotification(req, res){

//     Notification.findOneAndDelete({_id : req.params.id}).then(
//         res.json({
//             message : "Notification was Deleted"
//         })
//     ).catch(
//         () => {
//             console.log("Notification deletion failed")
//         }
//     )

// }

// export async function markAsRead(req, res) {
//   try {
//     const userId = req.user._id; // get logged in user ID from auth middleware

//     // Find all unread user notifications for this user and update isRead to true
//     await UserNotification.updateMany({ user_id: userId, isRead: false }, { $set: { isRead: true } });

//     res.json({ success: true });
//   } catch (error) {
//     console.error("Error marking notifications as read:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

// export async function membershipApprovalNotification(adminUserId, targetUserId) {
//   try {
   
//     const notification = new Notification({
//       title: 'Membership Approved',
//       body: 'Your membership request has been approved',
//       type: 'membership',
//       status: 'sent',
//       deliveryTo: targetUserId,
//       sentDate: new Date(),
//       createdBy: adminUserId
//     });
//     await notification.save();

//     const userNotification = new UserNotification({
//       NIC: notification._id,
//       user_id: targetUserId
//     });
//     await userNotification.save();

//     io.to(targetUserId).emit('membershipNotification', {
//       title: notification.title,
//       body: notification.body,
//       type: notification.type,
//       timestamp: notification.sentDate
//     });

//     console.log(`Notification sent to user ${targetUserId}`);
//   } catch (error) {
//     console.error('Error sending notification:', error);
//     throw error; // Rethrow for handling in caller
//   }
// }




import mongoose from 'mongoose';
import Notification from '../model/notification.js';
import UserNotification from '../model/userNotification.js';
import User from '../model/user.js';

export function viewNotifications(req, res) {
  Notification.find()
    .then((notifi) => res.json(notifi))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Notification loading failed' });
    });
}

export async function getMyNotifications(req, res) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    //if (req.user.role !== 'member') return res.status(403);
    
    const userId =
      typeof req.user._id === 'string'
        ? new mongoose.Types.ObjectId(req.user._id)
        : req.user._id;

    const rows = await UserNotification.aggregate([
      { $match: { user_id: userId } },
      {
        $lookup: {
          from: 'notifications',
          localField: 'NIC',
          foreignField: '_id',
          as: 'notification'
        }
      },
      { $unwind: '$notification' },
      {
        $project: {
          _id: 1,
          isRead: 1,
          createdAt: 1,
          'notification._id': 1,
          'notification.title': 1,
          'notification.body': 1,
          'notification.type': 1,
          'notification.sentDate': 1
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    const data = rows.map(r => ({
      id: r._id,               
      title: r.notification.title,
      body: r.notification.body,
      type: r.notification.type,
      createdAt: r.notification.sentDate || r.createdAt,
      isRead: r.isRead
    }));

    res.json(data);
  } catch (e) {
    console.error('getMyNotifications error:', e);
    res.status(500).json({ message: 'Failed to load notifications', error: e.message });
  }
}


export async function createPromotionalNotification(req, res) {
  try {
    const { title, body, type = 'promotional' } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: 'Please provide title and body.' });
    }

    const notification = new Notification({
      title,
      body,
      type,
      status: 'sent',
      deliveryTo: 'all_members',
      sentDate: new Date(),
      createdBy: req.user?._id 
    });
    await notification.save();

    const members = await User.find({ role: 'member' });
    const bulk = members.map(m => ({
      insertOne: { document: { NIC: notification._id, user_id: m._id, isRead: false } }
    }));
    if (bulk.length) await UserNotification.bulkWrite(bulk);

    res.status(201).json({
      message: 'Notification created and attached to all members',
      notificationId: notification._id,
      affectedMembers: members.length
    });
  } catch (error) {
    console.error('createPromotionalNotification error:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
}


export async function createNotificationForUser(req, res) {
  try {
    const { title, body, type = 'info', userId } = req.body;
    if (!title || !body || !userId) {
      return res.status(400).json({ message: 'title, body, userId are required' });
    }
    const targetId = new mongoose.Types.ObjectId(userId);

    const notification = new Notification({
      title,
      body,
      type,
      status: 'sent',
      deliveryTo: userId,
      sentDate: new Date(),
      createdBy: req.user?._id
    });
    await notification.save();

    await new UserNotification({ NIC: notification._id, user_id: targetId }).save();

    res.status(201).json({ message: 'Notification created for user', notificationId: notification._id });
  } catch (e) {
    console.error('createNotificationForUser error:', e);
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
}


export function updateNotification(req, res) {
  Notification.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then((notifi) => res.json({ message: 'Notification Updated Successfully', notifi }))
    .catch(() => res.status(500).json({ message: 'Notification update failed' }));
}


export function deleteNotification(req, res) {
  Notification.findOneAndDelete({ _id: req.params.id })
    .then(() => res.json({ message: 'Notification was Deleted' }))
    .catch(() => res.status(500).json({ message: 'Notification deletion failed' }));
}


export async function markAsRead(req, res) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    
    const userId =
      typeof req.user._id === 'string'
        ? new mongoose.Types.ObjectId(req.user._id)
        : req.user._id;

    const result = await UserNotification.updateMany(
      { user_id: userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ success: true, modified: result.modifiedCount ?? result.nModified ?? 0 });
  } catch (error) {
    console.error('markAsRead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
