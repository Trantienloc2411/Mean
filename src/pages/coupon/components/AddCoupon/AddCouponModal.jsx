import { Modal, Form, Input, DatePicker, Radio, Checkbox, Button, message } from 'antd';
import styles from './AddCouponModal.module.scss';
import dayjs from 'dayjs';

const AddCouponModal = ({ isOpen, onCancel, onConfirm, isLoading }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // Disallow selecting dates and times before current time
  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  // Disable past hours for today's date
  const disabledDateTime = (date) => {
    if (date && date.isSame(dayjs(), 'day')) {
      const currentHour = dayjs().hour();
      const currentMinute = dayjs().minute();
      const currentSecond = dayjs().second();

      return {
        disabledHours: () => Array.from({ length: currentHour }, (_, i) => i),
        disabledMinutes: (selectedHour) => 
          selectedHour === currentHour 
            ? Array.from({ length: currentMinute }, (_, i) => i)
            : [],
        disabledSeconds: (selectedHour, selectedMinute) => 
          selectedHour === currentHour && selectedMinute === currentMinute
            ? Array.from({ length: currentSecond }, (_, i) => i)
            : [],
      };
    }
    return {};
  };

  // Handle start date-time change to validate end date-time
  const handleStartDateChange = (date) => {
    const endDate = form.getFieldValue('endDate');
    if (endDate && date && date.isAfter(endDate)) {
      form.setFieldValue('endDate', null);
      messageApi.error({
        content: 'Thời gian kết thúc phải sau thời gian bắt đầu',
        className: 'custom-message',
        style: {
          marginTop: '20vh',
        },
      });
    }
  };

  const validateForm = (values) => {
    const { name, startDate, endDate, discountBasedOn, amount, maxDiscount } = values;

    if (!name?.trim()) {
      messageApi.error({
        content: 'Vui lòng nhập tên mã giảm giá',
        className: 'custom-message',
        style: {
          marginTop: '20vh',
        },
      });
      return false;
    }

    if (!startDate || !endDate) {
      messageApi.error({
        content: 'Vui lòng chọn thời gian bắt đầu và kết thúc',
        className: 'custom-message',
        style: {
          marginTop: '20vh',
        },
      });
      return false;
    }

    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      messageApi.error({
        content: 'Thời gian bắt đầu không thể sau thời gian kết thúc',
        className: 'custom-message',
        style: {
          marginTop: '20vh',
        },
      });
      return false;
    }

    if (!discountBasedOn) {
      messageApi.error({
        content: 'Vui lòng chọn hình thức giảm giá',
        className: 'custom-message',
        style: {
          marginTop: '20vh',
        },
      });
      return false;
    }

    if (!amount || amount <= 0) {
      messageApi.error({
        content: 'Giá trị giảm giá phải lớn hơn 0',
        className: 'custom-message',
        style: {
          marginTop: '20vh',
        },
      });
      return false;
    }

    if (discountBasedOn === 'Percentage' && amount > 100) {
      messageApi.error({
        content: 'Giá trị phần trăm không thể vượt quá 100%',
        className: 'custom-message',
        style: {
          marginTop: '20vh',
        },
      });
      return false;
    }

    if (maxDiscount && maxDiscount <= 0) {
      messageApi.error({
        content: 'Giảm giá tối đa phải lớn hơn 0',
        className: 'custom-message',
        style: {
          marginTop: '20vh',
        },
      });
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    form.validateFields()
      .then((values) => {
        // Format dates to match API requirements
        const formattedValues = {
          ...values,
          startDate: values.startDate.format('DD/MM/YYYY HH:mm:ss'),
          endDate: values.endDate.format('DD/MM/YYYY HH:mm:ss'),
        };

        if (validateForm(formattedValues)) {
          onConfirm(formattedValues);
          form.resetFields();
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
        messageApi.error('Vui lòng kiểm tra lại thông tin nhập vào');
      });
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Thêm mã giảm giá"
        open={isOpen}
        onCancel={() => {
          form.resetFields();
          onCancel();
        }}
        footer={[
          <Button 
            key="cancel" 
            color='default' 
            variant='outlined' 
            onClick={() => {
              form.resetFields();
              onCancel();
            }}
            disabled={isLoading}
          >
            Huỷ
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            color='default' 
            variant='solid' 
            onClick={handleSubmit}
            loading={isLoading}
          >
            Thêm mã giảm giá
          </Button>
        ]}
        width={600}
        destroyOnClose={true}
      >
        <Form
          form={form}
          layout="vertical"
          name="addCouponForm"
          preserve={false}
          initialValues={{
            isActive: true
          }}
        >
          <Form.Item
            name="name"
            label="Tên mã giảm giá"
            rules={[{ required: true, message: 'Hãy nhập tên mã giảm giá' }]}
          >
            <Input placeholder="Deal 10% cho bạn mới" />
          </Form.Item>

          <Form.Item
            name="code"
            label="Mã giảm giá (CODE)"
            rules={[
              { required: true, message: 'Hãy nhập mã giảm giá (CODE)' },
              { 
                max: 8, 
                message: 'Mã giảm giá không được vượt quá 8 ký tự' 
              },
              { 
                min: 1, 
                message: 'Mã giảm giá phải có ít nhất 1 ký tự' 
              },
              {
                pattern: /^[A-Z0-9]+$/,
                message: 'Mã giảm giá chỉ được chứa chữ in hoa và số'
              }
            ]}
            normalize={(value) => value ? value.toUpperCase() : value}
          >
            <Input 
              placeholder="DEAL10P" 
              maxLength={8}
              showCount
              onChange={(e) => {
                const value = e.target.value;
                // Remove any characters that aren't uppercase letters or numbers
                e.target.value = value.replace(/[^A-Z0-9]/g, '');
              }}
            />
          </Form.Item>

          <Form.Item
            name="startDate"
            label="Thời gian bắt đầu kích hoạt"
            rules={[{ required: true, message: 'Hãy chọn thời gian bắt đầu kích hoạt' }]}
          >
            <DatePicker
              showTime={{
                format: 'HH:mm:ss',
                defaultValue: dayjs().startOf('day'),
              }}
              style={{ width: '100%' }}
              format="DD/MM/YYYY HH:mm:ss"
              placeholder="01/01/2025 00:00:00"
              disabledDate={disabledDate}
              disabledTime={disabledDateTime}
              onChange={handleStartDateChange}
              minuteStep={1}
              secondStep={15}
            />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="Thời gian hết hạn"
            rules={[
              { required: true, message: 'Hãy chọn thời gian hết thúc của mã giảm giá' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || !getFieldValue('startDate')) {
                    return Promise.resolve();
                  }
                  
                  const startDate = getFieldValue('startDate');
                  // Convert to dayjs if not already
                  const endMoment = dayjs.isDayjs(value) ? value : dayjs(value);
                  const startMoment = dayjs.isDayjs(startDate) ? startDate : dayjs(startDate);
                  
                  if (endMoment.isBefore(startMoment) || endMoment.isSame(startMoment)) {
                    return Promise.reject(new Error('Thời gian kết thúc phải sau thời gian bắt đầu'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <DatePicker
              showTime={{
                format: 'HH:mm:ss',
                defaultValue: dayjs().endOf('day'),
              }}
              style={{ width: '100%' }}
              format="DD/MM/YYYY HH:mm:ss"
              placeholder="31/01/2025 23:59:59"
              disabledDate={(current) => {
                const startDate = form.getFieldValue('startDate');
                return (
                  disabledDate(current) || 
                  (startDate && current && current.isBefore(startDate, 'day'))
                );
              }}
              disabledTime={(date) => {
                const startDate = form.getFieldValue('startDate');
                if (startDate && date && date.isSame(startDate, 'day')) {
                  return {
                    disabledHours: () => Array.from(
                      { length: startDate.hour() }, 
                      (_, i) => i
                    ),
                    disabledMinutes: (selectedHour) => 
                      selectedHour === startDate.hour()
                        ? Array.from(
                            { length: startDate.minute() }, 
                            (_, i) => i
                          )
                        : [],
                    disabledSeconds: (selectedHour, selectedMinute) => 
                      selectedHour === startDate.hour() && 
                      selectedMinute === startDate.minute()
                        ? Array.from(
                            { length: startDate.second() }, 
                            (_, i) => i
                          )
                        : [],
                  };
                }
                return disabledDateTime(date);
              }}
              minuteStep={1}
              secondStep={15}
            />
          </Form.Item>

          <Form.Item
            name="discountBasedOn"
            label="Đây là loại giảm giá theo..."
            rules={[{ required: true, message: 'Hãy chọn một trong hai loại' }]}
          >
            <Radio.Group>
              <Radio value="Percentage">Phần trăm (%)</Radio>
              <Radio value="Fixed">Lượng cố định (vnđ)</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="amount"
            label="Giá trị"
            rules={[{ required: true, message: 'Hãy nhập giá trị' }]}
          >
            <Input 
              type="number" 
              placeholder="10" 
              min={0}
              max={form.getFieldValue('discountBasedOn') === 'Percentage' ? 100 : undefined}
            />
          </Form.Item>

          <Form.Item
            name="maxDiscount"
            label="Giảm giá tối đa (không bắt buộc)"
          >
            <Input 
              type="number" 
              placeholder="1,000" 
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="isActive"
            valuePropName="checked"
          >
            <Checkbox 
              style={{
                color:'#000000'
              }}
            >
              Kích hoạt?
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddCouponModal;