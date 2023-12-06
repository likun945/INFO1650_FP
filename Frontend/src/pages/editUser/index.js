import React, { useState, useEffect } from 'react';
import {
    Button,
    Checkbox,
    Form,
    Input,
    Radio,
    Select,
    Upload,
    message,
    Flex,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useRequest from '../../hooks/useRequest';
import useAuth from '../../hooks/useAuth';
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
    const { isAuthenticated, email } = useAuth();
    const { request } = useRequest('/user', { method: 'POST'})
    const interestsOptions = [
        { label: 'City views', value: 0 },
        { label: 'Natural views', value: 1 },
        { label: 'Historical sites', value: 2 },
        { label: 'Cultural scenes', value: 3 },
        { label: 'Adventure and sports', value: 4 },
    ];
    const [userInfo, setUserInfo] = useState({});
    const fetchUserInfo = async () => {
        const info = await request({
            email
        })
        if(info && info.data && info.data.users) {
            setUserInfo(info.data.users[0]);
        }
    }
    useEffect(() => {
        if(!isAuthenticated) {
            navigate('/login');
        }else {
            fetchUserInfo()
        }   
    }, [])
    useEffect(() => {
        if (Object.keys(userInfo).length > 0) {
            const firstName = userInfo.fullName.split(' ')[0];
            const lastName = userInfo.fullName.split(' ')[1];
            form.setFieldsValue({
                firstName,
                lastName,
                gender: userInfo.gender,
                country: userInfo.country,
                description: userInfo.description,
                age: userInfo.age,
                interest: userInfo.interest
            });
        }
    }, [userInfo, form]);
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
    console.log()

    useEffect(() => {

    })
    const handleUploadChange = async ({ file, fileList: newFileList }) => {
        setFileList(newFileList);

        const latestFile = newFileList[newFileList.length - 1];
        if (latestFile && latestFile.originFileObj) {
            try {
                const base64 = await getBase64(latestFile.originFileObj);
                console.log(base64);
                form.setFieldsValue({ avatar: base64 });
            } catch (error) {
                console.error('Error reading file:', error);
            }
        }
    };
    const handleSubmit = async (values) => {
        console.log(values); // 这里会打印出所有表单字段的值
        try {
            const submissionData = { ...values, avatar: 'https://files.oaiusercontent.com/file-gGpV243etTouWHMtLPAOvo7I?se=2023-12-06T22%3A01%3A54Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3D35750207-b47b-4a55-aed5-d6eea15f3f26.webp&sig=KxkmfgzOnrHp8ovO/sdL4XCFPmu5hSFz6o643tDGP0w%3D' };
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
            navigate('/login');
        } catch (error) {
            console.error('error in submitting form', error);
            message.error('Error submitting form');
        }
    };
    return (
        <Flex className="formContainer"  justify='center'>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
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
                    <Input  />
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
                            <Select.Option key={country.id} value={Number(country.id)}>{country.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, pattern: /^[a-zA-Z ]{1,200}$/, message: 'Invalid description, description should be 1 to 200 letters' }]}
                >
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Avatar" name="avatar" rules={[{required: true, message: 'You should upload your avatar'}]}>
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleUploadChange}
                        beforeUpload={() => false}
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
                        return parseInt(event.target.value, 10); 
                    }}
                >
                    <Input type="number"  />
                </Form.Item>
                <Form.Item 
                label="Interests" 
                name="interest"
                rules={[{ required: true, message: 'Please select at least one interest', type: 'array' }]}
                >
                    <Checkbox.Group options={interestsOptions}/>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 10 }}>
                    <Button type="primary" htmlType="submit">
                        Update
                    </Button>
                </Form.Item>
            </Form>
        </Flex>
    );
};

export default RegistrationPage;
