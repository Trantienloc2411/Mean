import { Modal, Form, Input, InputNumber, Select, Button, Spin, Image, Upload, message } from "antd";
import { useGetAllAmenitiesQuery } from '../../../../../../../../redux/services/serviceApi';
import styles from './AddRoomTypeModal.module.scss';
import { useState } from "react";
import { supabase } from "../../../../../../../../redux/services/supabase";
import { InboxOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useGetOwnerDetailByUserIdQuery } from '../../../../../../../../redux/services/ownerApi';
import { useParams } from "react-router-dom";
import AddAmenityModal from '../../../RoomAmenitiesManagement/components/AddAmenityModal/AddAmenityModal';
import { useCreateAmenityMutation } from '../../../../../../../../redux/services/serviceApi';
import { useEffect } from "react";

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const MAX_IMAGES = 10;

const AddRoomTypeModal = ({ isOpen, onCancel, onConfirm }) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [createAmenity, { isLoading: isCreatingService }] = useCreateAmenityMutation();
  const [nameError, setNameError] = useState(null); 

  const { data: ownerDetailData } = useGetOwnerDetailByUserIdQuery(id);
  let ownerId = ownerDetailData?.id;

  if (!ownerId) {
    ownerId = localStorage.getItem('ownerId');
  }

  const {
    data: services,
    isLoading: isServicesLoading,
    refetch: refetchServices
  } = useGetAllAmenitiesQuery(
    { ownerId },
    { skip: !ownerId }
  );

  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleNameChange = () => {
    if (nameError) {
      setNameError(null);
      form.setFields([{
        name: 'name',
        errors: []
      }]);
    }
  };

  const handleSubmit = () => {
    form.validateFields()
      .then((values) => {
        if (!ownerId) {
          message.error("Không tìm thấy thông tin chủ nhà!");
          return;
        }

        const formattedValues = {
          ...values,
          ownerId,
          numberOfPasswordRoom: values.numberOfPasswordRoom || 0,
          image: fileList.map(file => file.url),
          serviceIds: values.serviceIds || []
        };

        setNameError(null);
        
        onConfirm(formattedValues)
          .then(() => {
            form.resetFields();
            setFileList([]);
            setNameError(null);
          })
          .catch((error) => {
            if (error?.data?.message?.includes('already exists for this owner') || 
                error?.message?.includes('already exists for this owner')) {
              setNameError('Tên loại phòng đã tồn tại, vui lòng nhập tên khác');
              form.setFields([{
                name: 'name',
                errors: ['Tên loại phòng đã tồn tại, vui lòng nhập tên khác']
              }]);
              form.getFieldInstance('name')?.focus();
            } else {
              message.error(error?.data?.message || error?.message || "Thêm loại phòng thất bại");
            }
          });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const uploadProps = {
    name: "file",
    multiple: true,
    accept: ".jpg,.jpeg,.png",
    maxCount: MAX_IMAGES,
    beforeUpload: (file) => {
      if (fileList.length >= MAX_IMAGES) {
        message.error(`Bạn chỉ được tải lên tối đa ${MAX_IMAGES} ảnh!`);
        return Upload.LIST_IGNORE;
      }
      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("Chỉ cho phép tải lên file JPG/PNG!");
        return Upload.LIST_IGNORE;
      }
      if (file.size / 1024 / 1024 >= 5) {
        message.error("Hình ảnh phải nhỏ hơn 5MB!");
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      setUploading(true);
      const fileName = `${Date.now()}-${file.name}`;

      try {
        const { data, error } = await supabase.storage
          .from("image")
          .upload(fileName, file, { cacheControl: "3600", upsert: false });

        if (error || !data) throw new Error("Tải ảnh lên thất bại!");

        const { data: urlData } = supabase.storage
          .from("image")
          .getPublicUrl(data.path);
        if (!urlData.publicUrl) throw new Error("Không lấy được URL ảnh!");

        setFileList(prev => [
          ...prev,
          {
            uid: file.uid,
            url: urlData.publicUrl,
            name: fileName,
            path: data.path,
          }
        ]);

        message.success("Tải ảnh lên thành công!");
        onSuccess("ok");
      } catch (error) {
        message.error(error.message);
        onError(error);
      } finally {
        setUploading(false);
      }
    },
  };

  const handleRemove = async (file) => {
    setUploading(true);
    try {
      const filePath = file.path || file.name;
      const { error } = await supabase.storage.from("image").remove([filePath]);

      if (error) throw error;

      setFileList(prev => prev.filter(item => item.uid !== file.uid));
      message.success("Đã xóa ảnh!");
    } catch (error) {
      message.error("Lỗi khi xóa ảnh!");
    } finally {
      setUploading(false);
    }
  };

  const handleAddService = async (values) => {
    try {
      const newService = await createAmenity({
        ...values,
        ownerId,
        status: values.status === "Active",
        isDelete: false
      }).unwrap();

      await refetchServices();

      const currentServices = form.getFieldValue('serviceIds') || [];
      form.setFieldsValue({
        serviceIds: [...currentServices, newService._id]
      });

      message.success("Thêm dịch vụ thành công!");
      setIsAddServiceModalOpen(false);
    } catch (error) {
      message.error(`Lỗi khi thêm dịch vụ: ${error.message}`);
    }
  };

  const getServicesOptions = () => {
    const servicesList = services?.data || services || [];
    return servicesList
      .filter(service => service.status)
      .map(service => ({
        label: service.name,
        value: service._id
      }));
  };

  useEffect(() => {
    if (!isOpen) {
      setNameError(null);
    }
  }, [isOpen]);

  return (
    <Modal
      title="Thêm loại phòng mới"
      open={isOpen}
      onCancel={() => {
        setNameError(null);
        onCancel();
      }}
      footer={[
        <Button key="cancel" onClick={() => {
          setNameError(null);
          onCancel();
        }}>
          Huỷ
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={uploading}
        >
          Thêm loại phòng
        </Button>
      ]}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        name="addRoomTypeForm"
        className={styles.modalForm}
      >

        <Form.Item
          name="serviceIds"
          label="Dịch vụ"
          rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn dịch vụ"
            loading={isServicesLoading}
            options={getServicesOptions()}
            dropdownRender={(menu) => (
              <>
                {menu}
                <div
                  style={{
                    padding: '8px',
                    cursor: 'pointer',
                    borderTop: '1px solid #e8e8e8'
                  }}
                  onClick={() => setIsAddServiceModalOpen(true)}
                >
                  <PlusOutlined /> Thêm dịch vụ mới
                </div>
              </>
            )}
          />
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên loại phòng"
          rules={[{ required: true, message: 'Vui lòng nhập tên loại phòng' }]}
          validateStatus={nameError ? 'error' : ''}
          help={nameError}
        >
          <Input 
            placeholder="Nhập tên loại phòng" 
            onChange={handleNameChange}
            style={nameError ? { borderColor: '#ff4d4f' } : {}}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
        >
          <TextArea rows={4} placeholder="Nhập mô tả cho loại phòng" />
        </Form.Item>

        <div className={styles.formRow}>
          <Form.Item
            name="maxPeopleNumber"
            label="Số người tối đa"
            rules={[
              { required: true, message: 'Vui lòng nhập số người tối đa' },
              {
                type: 'number',
                min: 1,
                max: 2,
                message: 'Số người tối đa không được vượt quá 2'
              }
            ]}
            help="Số người tối đa không nên vượt quá 2"
          >
            <InputNumber min={1} max={2} placeholder="2" />
          </Form.Item>

          <Form.Item
            name="basePrice"
            label="Giá cơ bản"
            rules={[{ required: true, message: 'Vui lòng nhập giá cơ bản' }]}
          >
            <InputNumber
              min={0}
              step={100000}
              placeholder="200000"
              addonAfter="VNĐ"
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="overtimeHourlyPrice"
          label="Giá phụ trội theo giờ"
          rules={[{ required: true, message: 'Vui lòng nhập giá phụ trội theo giờ' }]}
        >
          <InputNumber
            min={0}
            step={10000}
            placeholder="20000"
            addonAfter="VNĐ"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          name="numberOfPasswordRoom"
          label="Độ dài mật khẩu phòng (số ký tự)"
          tooltip="Nhập số từ 1-10 cho độ dài mật khẩu, hoặc 0 nếu không cần mật khẩu"
          rules={[{
            required: true,
            message: 'Vui lòng nhập độ dài mật khẩu'
          }, {
            type: 'number',
            min: 0,
            max: 10,
            message: 'Độ dài mật khẩu phải từ 0 đến 10 (0 = không dùng mật khẩu)'
          }]}
          help="Nhập số từ 0-10 (0 = không yêu cầu mật khẩu)"
        >
          <InputNumber
            min={0}
            max={10}
            precision={0}
            placeholder="Độ dài mật khẩu (0-10)"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label={`Hình ảnh loại phòng (${fileList.length}/${MAX_IMAGES})`}>
          <Spin spinning={uploading} tip="Đang xử lý...">
            <Dragger {...uploadProps} showUploadList={false}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Kéo và thả ảnh vào đây hoặc nhấn để tải lên
              </p>
              <p className="ant-upload-hint">
                Hỗ trợ JPG, PNG. Tối đa {MAX_IMAGES} ảnh, mỗi ảnh ≤5MB
              </p>
            </Dragger>
          </Spin>

          <div style={{ display: "flex", flexWrap: "wrap", marginTop: 16, gap: 8 }}>
            {fileList.map((file) => (
              <div key={file.uid} style={{ position: "relative" }}>
                <Image
                  src={file.url}
                  width={100}
                  height={100}
                  style={{ objectFit: "cover", borderRadius: 8 }}
                />
                <DeleteOutlined
                  onClick={() => handleRemove(file)}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    color: "white",
                    background: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "50%",
                    padding: 4,
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                />
              </div>
            ))}
          </div>
        </Form.Item>
      </Form>

      <AddAmenityModal
        isOpen={isAddServiceModalOpen}
        onCancel={() => setIsAddServiceModalOpen(false)}
        onConfirm={handleAddService}
        isLoading={isCreatingService}
      />
    </Modal>
  );
};

export default AddRoomTypeModal;