import prisma from "../prisma/init.prisma.js";

const handleChatSocket = (io, socket) => {
  socket.on("join-room", (data) => {
    console.log("📢 [sever.js:34]", data);
    const { user_id_sender, user_id_recipient } = data;
    // tạo roomID: sắp xếp 2 id lại với nhau
    const roomId = [user_id_sender, user_id_recipient]
      .sort((a, b) => a - b)
      .join("_");

    // Đảm bảo thoát hết room trước khi join room
    socket.rooms.forEach((roomId) => {
      socket.leave(roomId);
    });
    socket.join(roomId);
  });

  socket.on("send-message", async (data) => {
    console.log({ data });
    const { message, user_id_sender, user_id_recipient } = data;
    const roomId = [user_id_sender, user_id_recipient]
      .sort((a, b) => a - b)
      .join("_");
    io.to(roomId).emit("receive-message", data);
    await prisma.chats.create({
      data: {
        message: message,
        user_id_sender: user_id_sender,
        user_id_recipient: user_id_recipient,
      },
    });
  });

  // Nến lấy danh sách message khởi tạo ban đầu bằng API
  // Không nên dùng bằng socket như phía dưới
  socket.on("get-list-message", async (data) => {
    console.log("get-list-message", { data });
    const { user_id_sender, user_id_recipient } = data;
    const chats = await prisma.chats.findMany({
      where: {
        OR: [
          // Lấy tin nhắn của mình
          {
            user_id_recipient: user_id_recipient,
            user_id_sender: user_id_sender,
          },
          // Lấy tin nhắn của đối phương
          {
            user_id_sender: user_id_sender,
            user_id_recipient: user_id_recipient,
          },
        ],
      },
    });
    socket.emit("get-list-message", chats);
  });
};

export default handleChatSocket;
