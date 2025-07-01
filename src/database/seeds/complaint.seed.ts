import { DataSource } from 'typeorm';
import { Complaint, ComplaintStatus, ComplaintPriority, ComplaintType } from '../../modules/complaints/entities/complaint.entity';

export const complaintSeed = async (dataSource: DataSource) => {
  const complaintRepository = dataSource.getRepository(Complaint);

  const complaints = [
    {
      title: 'Video chất lượng kém',
      description: 'Video được giao có chất lượng thấp, không đúng như yêu cầu ban đầu',
      status: ComplaintStatus.PENDING,
      priority: ComplaintPriority.HIGH,
      complaintType: ComplaintType.VIDEO_QUALITY,
      evidence: {
        images: [
          {
            url: 'https://example.com/screenshot1.jpg',
            description: 'Screenshot chất lượng thấp'
          },
          {
            url: 'https://example.com/screenshot2.jpg',
            description: 'So sánh với yêu cầu ban đầu'
          }
        ],
        evidenceDescription: 'Yêu cầu video chất lượng cao 1080p nhưng nhận được 480p',
        additionalData: {
          originalRequest: 'Yêu cầu video chất lượng cao 1080p',
          receivedQuality: '480p'
        }
      },
      userId: 1,
      orderId: 1,
      videoId: 1,
    },
    {
      title: 'Giao hàng trễ hạn',
      description: 'Đơn hàng được giao trễ 2 ngày so với thời hạn cam kết',
      status: ComplaintStatus.INVESTIGATING,
      priority: ComplaintPriority.MEDIUM,
      complaintType: ComplaintType.DELIVERY_TIME,
      evidence: {
        evidenceDescription: 'Đơn hàng được giao trễ so với cam kết',
        additionalData: {
          orderDate: '2024-01-15',
          promisedDelivery: '2024-01-20',
          actualDelivery: '2024-01-22'
        }
      },
      userId: 2,
      orderId: 2,
    },
    {
      title: 'Nội dung không phù hợp',
      description: 'Nội dung video không phù hợp với yêu cầu và có thể gây phản cảm',
      status: ComplaintStatus.RESOLVED,
      priority: ComplaintPriority.URGENT,
      complaintType: ComplaintType.CONTENT_ISSUE,
      resolution: 'Đã xem xét và đồng ý làm lại video theo yêu cầu mới',
      resolvedAt: new Date(),
      resolvedById: 3,
      evidence: {
        images: [
          {
            url: 'https://example.com/inappropriate-content.jpg',
            description: 'Nội dung không phù hợp'
          }
        ],
        evidenceDescription: 'Video chứa nội dung không phù hợp với yêu cầu',
        additionalData: {
          originalRequest: 'Video chúc mừng sinh nhật vui vẻ',
          receivedContent: 'Nội dung không phù hợp'
        }
      },
      userId: 1,
      orderId: 1,
      videoId: 1,
    },
    {
      title: 'Vấn đề thanh toán',
      description: 'Đã thanh toán nhưng hệ thống vẫn hiển thị chưa thanh toán',
      status: ComplaintStatus.PENDING,
      priority: ComplaintPriority.HIGH,
      complaintType: ComplaintType.PAYMENT_ISSUE,
      evidence: {
        images: [
          {
            url: 'https://example.com/payment-receipt.jpg',
            description: 'Biên lai thanh toán'
          }
        ],
        evidenceDescription: 'Đã thanh toán nhưng hệ thống không cập nhật',
        additionalData: {
          transactionId: 'TXN123456',
          paymentMethod: 'credit_card',
          amount: 50000,
          paymentDate: '2024-01-18'
        }
      },
      userId: 1,
      orderId: 1,
      videoId: 1,
    },
    {
      title: 'Yêu cầu chỉnh sửa',
      description: 'Cần chỉnh sửa một số chi tiết trong video theo yêu cầu mới',
      status: ComplaintStatus.INVESTIGATING,
      priority: ComplaintPriority.LOW,
      complaintType: ComplaintType.OTHER,
      evidence: {
        images: [
          {
            url: 'https://example.com/edit-request1.jpg',
            description: 'Yêu cầu thay đổi màu sắc'
          },
          {
            url: 'https://example.com/edit-request2.jpg',
            description: 'Yêu cầu thêm hiệu ứng âm thanh'
          }
        ],
        evidenceDescription: 'Cần chỉnh sửa theo yêu cầu mới',
        additionalData: {
          requestedChanges: [
            'Thay đổi màu sắc',
            'Thêm hiệu ứng âm thanh',
            'Cắt bớt thời lượng'
          ]
        }
      },
      userId: 1,
      orderId: 1,
      videoId: 1,
    },
  ];

  for (const complaintData of complaints) {
    const existingComplaint = await complaintRepository.findOne({
      where: { title: complaintData.title }
    });

    if (!existingComplaint) {
      const complaint = complaintRepository.create(complaintData);
      await complaintRepository.save(complaint);
      console.log(`Created complaint: ${complaint.title}`);
    }
  }

  console.log('Complaint seeding completed');
}; 