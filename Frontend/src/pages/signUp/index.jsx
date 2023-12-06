import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    Checkbox,
    Form,
    Input,
    Radio,
    Select,
    Upload,
    message
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.scss';

const { TextArea } = Input;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

const RegistrationPage = () => {
    const [form] = Form.useForm();
    const [countries, setCountries] = useState([]);
    const [fileList, setFileList] = useState([]);
    const navigate = useNavigate();

    const interestsOptions = [
        { label: 'City views', value: 0 },
        { label: 'Natural views', value: 1 },
        { label: 'Historical sites', value: 2 },
        { label: 'Cultural scenes', value: 3 },
        { label: 'Adventure and sports', value: 4 },
    ];

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/country');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (data.success) {
                    setCountries(data.data.countries);
                }
            } catch (error) {
                console.error('获取国家列表失败', error);
            }
        };

        fetchCountries();
    }, []);


    const beforeUpload = (file) => {
        const isImage = /\.(jpeg|jpg|png|gif)$/.test(file.name.toLowerCase());
        if (!isImage) {
            message.error('You can only upload image files!');
        }
        return isImage || Upload.LIST_IGNORE;
    };

    const handleUploadChange = async ({ fileList: newFileList }) => {
        console.log('Upload onChange triggered');
        setFileList(newFileList);

        const latestFile = newFileList[newFileList.length - 1];
        if (latestFile && latestFile.originFileObj) {
            try {
                // 将文件对象转换为 Blob
                const blob = new Blob([latestFile.originFileObj], { type: latestFile.originFileObj.type });
                console.log(blob);

                const formData = new FormData();
                formData.append('file', blob);
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}:`, value);
                }

                const response = await fetch('http://localhost:3000/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to upload file');
                }

                // 处理上传成功的响应
                const data = await response.json();

                console.log('File uploaded successfully', data);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };


    // ...其他函数，例如 handleInputChange, handlePreview, handleChange...

    const handleSubmit = async (values) => {
        console.log(values); // 这里会打印出所有表单字段的值

        try {
            const submissionData = { ...values };
            delete submissionData.avatar;
            const response = await fetch('http://localhost:3000/api/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            message.success('Registration successful');
            navigate('/login');// 跳转到登录页面
            // 处理响应
        } catch (error) {
            console.error('error in submitting form', error);
            message.error('Error submitting form');
            // 错误处理
        }
    };


    return (
        <div className="formContainer">
            <Form
                form={form}
                layout="horizontal"
                onFinish={handleSubmit}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                style={{ maxWidth: 600 }}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, message: 'The password is too weak' }]}
                >
                    <Input.Password />
                </Form.Item>
                {/* ...其他表单元素... */}
                <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[{ required: true, pattern: /^[a-zA-Z ]{1,50}$/, message: 'Invalid first name' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[{ required: true, pattern: /^[a-zA-Z ]{1,50}$/, message: 'Invalid last name' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[{ required: true, message: 'Please select a gender' }]}
                >
                    <Radio.Group >
                        <Radio value={0}>Female</Radio>
                        <Radio value={1}>Male</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label="Country"
                    name="country"
                    rules={[{ required: true, message: 'Please select a country' }]}
                >
                    <Select >
                        {countries.map(country => (
                            <Select.Option key={country.id} value={country.id}>{country.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                {/* ...其他表单元素... */}
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, pattern: /^[a-zA-Z ]{1,200}$/, message: 'Invalid description, description should be 1 to 200 letters' }]}
                >
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Avatar" name="avatar">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleUploadChange}
                        beforeUpload={beforeUpload}
                    >
                        {fileList.length < 1 && <PlusOutlined />}
                    </Upload>
                </Form.Item>
                <Form.Item
                    label="Age"
                    name="age"
                    rules={[
                        { required: true, message: 'Please input your age' },
                        { type: 'number', min: 15, max: 99, message: 'Age must be between 15 and 99' }
                    ]}
                    getValueFromEvent={(event) => {
                        return parseInt(event.target.value, 10); // 转换字符串为数字
                    }}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item
                    label="Interests"
                    name="interest"
                    rules={[{ required: true, message: 'Please select at least one interest', type: 'array' }]}
                >
                    <Checkbox.Group options={interestsOptions} />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 4 }}>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RegistrationPage;
