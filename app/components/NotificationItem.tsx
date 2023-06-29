interface INotificationProps {
 message: string,
}
 
const NotificationItem = ({ message } : INotificationProps) => {
  return (<div className="fixed bottom-0 right-0 mb-4 mr-4 z-50">
  <div className="bg-green-100 border-t-4 border-green-500 rounded-b text-green-900 px-4 py-3 shadow-md" role="alert">
      <div className="flex">
        <p className="font-bold">{message}</p>
      </div>
  </div>
</div>
);
};

export default NotificationItem;
