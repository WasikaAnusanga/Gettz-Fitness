import Notification from '../model/notification.js'; 
import UserNotification from '../model/userNotification.js';
import { io } from '../index.js';

export function viewNotifications(req, res){

        Notification.find().then(
            (notifi) => {
                res.json(notifi)
            }
        ).catch(
            (error) => {
                console.log(error)
                res.status(500).json({
                    message : "Notification loading failed"
                })
            }
        )
}

export async function createPromotionalNotification(req, res){

    // if(req.user == null){
    //     res.status(403).json({
    //         message: "Please login to create promotional announcement"
    //     });
    //     return;
    // }

    // if(req.user.role != "admin"){
    //     res.status(403).json({
    //         message: "Login as an admin to create promotional announcement"
    //     });
    //     return;
    // }

    try {

        const { title, body, type = 'promotional' } = req.body;

        if (!title || !body) {
            res.status(400).json({ 
                message: 'Please provide title and body.' 
            });
            return
        }

        const notification = new Notification({
            title,
            body,
            type,
            status: 'sent',
            deliveryTo: 'all_members',
            sentDate: new Date(),
            createdBy: req.user.adminId
        });

        await notification.save();

        const members = await User.find({ role: 'member' });

        for (const member of members) {
            const userNotification = new UserNotification({
                NIC: notification._id,
                user_id: member._id
            });

            await userNotification.save();

            io.to(member._id.toString()).emit('promotionalNotification', {
                title: notification.title,
                body: notification.body,
                type: notification.type,
                timestamp: notification.sentDate
            });

        }

        res.status(201).json({ message: 'Notification created and sent to all members successfully', notification });

    } catch (error) {

        console.error('Error creating notification for all members:', error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });

    }
}

export function updateNotification(req,res){

    Notification.findOneAndUpdate({_id : req.params.id}, req.body).then(
        (notifi) => {
            res.json({
                message : "Notification Updated Successfully",
                notifi
            })
        }
    ).catch(
        console.log("Notification Udate Failed")
    )

}

export function deleteNotification(req, res){

    Notification.findOneAndDelete({_id : req.params.id}).then(
        res.json({
            message : "Notification was Deleted"
        })
    ).catch(
        () => {
            console.log("Notification deletion failed")
        }
    )

}

export async function membershipApprovalNotification(adminUserId, targetUserId) {
  try {
   
    const notification = new Notification({
      title: 'Membership Approved',
      body: 'Your membership request has been approved',
      type: 'membership',
      status: 'sent',
      deliveryTo: targetUserId,
      sentDate: new Date(),
      createdBy: adminUserId
    });
    await notification.save();

    const userNotification = new UserNotification({
      NIC: notification._id,
      user_id: targetUserId
    });
    await userNotification.save();

    io.to(targetUserId).emit('membershipNotification', {
      title: notification.title,
      body: notification.body,
      type: notification.type,
      timestamp: notification.sentDate
    });

    console.log(`Notification sent to user ${targetUserId}`);
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error; // Rethrow for handling in caller
  }
}

// export async function mealplanRequestToTrainer()
