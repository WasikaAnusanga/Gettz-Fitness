export default function generateID() {
            const now = new Date()
            const month = (now.getMonth() + 1).toString()
            const day = now.getDate().toString().padStart(2, '0')
            const hour = now.getHours().toString()
            const minute = now.getMinutes().toString().padStart(2,'0')
            
            return "gym" + month + day + hour + minute;

        }