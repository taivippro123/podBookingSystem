import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import dayjs from 'dayjs'; // Nếu bạn dùng dayjs để xử lý ngày
import styles from './MyCalendar.module.css';

Modal.setAppElement('#root');

const MyCalendar = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lấy ngày hiện tại
  const today = dayjs().format('YYYY-MM-DD'); // Lấy ngày hiện tại theo định dạng YYYY-MM-DD

  const handleEventClick = (info) => {
    setSelectedEvent({
      title: info.event.title,
      start: info.event.startStr,
      description: info.event.extendedProps.description,
    });
    setIsModalOpen(true);
  };

  return (
    <div className={styles.calendarContainer}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        // Chỉ định ngày hôm nay
        dayCellClassNames={(date) => {
          return date.date === today ? styles.today : ''; // Nếu ngày là hôm nay, thêm lớp today
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
        contentLabel="Booking Details"
      >
        <h3 className={styles.modalTitle}>{selectedEvent?.title}</h3>
        <p className={styles.modalDate}><strong>Date:</strong> {selectedEvent?.start}</p>
        <div className={styles.modalDescription}>
          <strong>Description:</strong>
          <p>{selectedEvent?.description}</p>
        </div>
        <button className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>Cancel</button>
      </Modal>
    </div>
  );
};

export default MyCalendar;
