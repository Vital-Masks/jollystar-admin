import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../store/themeConfigSlice';
import IconUsersGroup from '../components/Icon/IconUsersGroup';
import IconThumbUp from '../components/Icon/IconThumbUp';
import IconTrash from '../components/Icon/IconTrash';
import IconFolderPlus from '../components/Icon/IconFolderPlus';
import IconNotesEdit from '../components/Icon/IconNotesEdit';
import { Link, NavLink } from 'react-router-dom';
import IconPlus from '../components/Icon/IconPlus';
import IconHome from '../components/Icon/IconHome';
import IconDollarSignCircle from '../components/Icon/IconDollarSignCircle';
import IconPhone from '../components/Icon/IconPhone';
import IconLinkedin from '../components/Icon/IconLinkedin';
import IconTwitter from '../components/Icon/IconTwitter';
import IconFacebook from '../components/Icon/IconFacebook';
import IconGithub from '../components/Icon/IconGithub';
import IconUser from '../components/Icon/IconUser';
import IconLaptop from '../components/Icon/IconLaptop';
import IconPlayCircle from '../components/Icon/IconPlayCircle';
import IconAt from '../components/Icon/IconAt';
import Swal from 'sweetalert2';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper';
import themeConfig from '../theme.config';
import { convertFileToBase64 } from '../components/utils/fileUtils'
import axios, { AxiosResponse } from 'axios';
import CustomSelect from '../components/core/select';

interface SchoolDetail {
    schoolName: string;
    participated: string;
    game: string;
    from: string;
    to: string;
    role: string;
}

interface ClubDetail {
    clubName: string;
    invloved: string;
    game: string;
    from: string;
    to: string;
    role: string;
}

interface PaymentDetails {
    memberId: string;
    bank: string;
    branch: string;
    total: string;
    date: string;
    paymentSlip: string;
}
interface FormValues {
    category: string;
    userName: string;
    title: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    passportNumber: string;
    email: string;
    phoneNumber: string;
    telephoneNumber: string;
    address: string;
    maritalStatus: string;
    password: string;
    confirmPassword: string;
    workPlaceName: string;
    occupation: string;
    officeAddress: string;
    profilePicture: string | null;
    schoolDetails: SchoolDetail[];
    sdschoolName: string;
    sdparticipated: string;
    sdgame: string;
    sdfrom: string;
    sdto: string;
    sdrole: string;
    clubDetails: ClubDetail[];
    cdclubName: string;
    cdinvloved: string;
    cdgame: string;
    cdfrom: string;
    cdto: string;
    cdrole: string;
    paymentDetails: PaymentDetails[];
    pdcategory: string;
    pdbank: string;
    pdbranch: string;
    pdtotal: string;
    pddate: string;
    pdpaymentImage: string;
    isSchoolDetailVerified: boolean;
    isPaymentDetailVerified: boolean;
}

interface MemberData {
    membershipCategory: string;
    profilePicture: string | any; // Replace with the actual type of profilePicture
    title: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    passportNumber: string;
    email: string;
    userName: string;
    password: string;
    phoneNumber: string;
    telephoneNumber: string;
    address: string;
    maritalStatus: string;
    workPlaceName: string;
    occupation: string;
    officeAddress: string;
    schoolDetails: any[]; // Replace with the actual type of schoolDetails
    clubDetails: any[]; // Replace with the actual type of clubDetails
    paymentDetails: any; // Replace with the actual type of paymentDetails
    gallery: number[];
    isSchoolDetailVerified: boolean;
    isPaymentDetailVerified: boolean;
    memberApprovalStatus: string;
    membershipId: string;
    declinedMessage: string;
}

const AddNewMember = () => {
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);
    const [Loading, setLoading] = useState(false)
    const [currentDateTime, setCurrentDateTime] = useState<string>('');
    useEffect(() => {
        const getCurrentDateTime = () => {
            const options: Intl.DateTimeFormatOptions = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            };

            const formattedDateTime = new Intl.DateTimeFormat('en-US', options).format(new Date());

            setCurrentDateTime(formattedDateTime);
        };

        getCurrentDateTime(); // Initial call

        // Update every minute
        const intervalId = setInterval(getCurrentDateTime, 60000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        dispatch(setPageTitle('AddNewMember Admin'));
    });
    const [tabs, setTabs] = useState<string>('home');
    const toggleTabs = (name: string) => {
        setTabs(name);
    };
    const [isSclChecked, setIsSclChecked] = useState(true);
    const [ispayChecked, setIsPayChecked] = useState(true);
    const [formValues, setFormValues] = useState<FormValues>({
        // Define your form fields here
        category: '',
        userName: '',
        title: 'mr',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        passportNumber: '',
        email: '',
        phoneNumber: '',
        telephoneNumber: '',
        address: '',
        maritalStatus: '',
        password: '',
        confirmPassword: '',
        "workPlaceName": "Virtusa",
        "occupation": "Software engineer",
        "officeAddress": "Colombo",
        profilePicture: null, // Store the file in the state
        schoolDetails: [],
        sdschoolName: '', sdparticipated: '', sdgame: '', sdfrom: '', sdto: '', sdrole: '',
        clubDetails: [],
        cdclubName: '', cdinvloved: '', cdgame: '', cdfrom: '', cdto: '', cdrole: '',
        paymentDetails: [],
        pdcategory: '', pdbank: '', pdbranch: '', pdtotal: '', pddate: '', pdpaymentImage: '',
        isSchoolDetailVerified:isSclChecked,
        isPaymentDetailVerified:ispayChecked,
    });

    const items = ['carousel1.jpeg', 'carousel2.jpeg', 'carousel3.jpeg'];
   

    const submitForm = () => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
        });
        toast.fire({
            icon: 'success',
            title: 'Form submitted successfully',
            padding: '10px 20px',
        });
    };
    const sucessForm = () => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
        });
        toast.fire({
            icon: 'success',
            title: 'Member add successfully',
            padding: '10px 20px',
        });
    };
    const failForm = () => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
        });
        toast.fire({
            icon: 'error',
            title: 'Member add unsuccessfully',
            padding: '10px 20px',
        });
    };
   
    const handleChange = (e: React.ChangeEvent<HTMLInputElement| HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };
    const tableData = [
        {
            id: 1,
            firstname: 'John',
            lastname: 'Doe',
            membershiptype: 'johndoe',
            dateapplied: '10/08/2020',
            passportNumber: '954646466V',
            phoneNumber: '073777777777',
        },
    ];
    const addMember = async (data: MemberData): Promise<AxiosResponse<any>> => {
        try {
            const response = await axios.post('http://localhost:3000/api/member', data);
            console.log('Member added successfully:', response.data);
            // Call your success function here
            sucessForm()
            return response;
        } catch (error) {
            console.error('Error adding member:', error);
            failForm()
            throw error;
        }
    };


    const handleSubmit = async () => {
        setLoading(true);

        console.log(formValues, "ALL DAta");
        var data: MemberData = {
            "membershipCategory": formValues.category,
            "profilePicture": formValues.profilePicture,
            "title": "Mr",
            "firstName": formValues.firstName,
            "lastName": formValues.lastName,
            "dateOfBirth": formValues.dateOfBirth,
            "passportNumber": formValues.passportNumber,
            "email": formValues.email,
            "userName": formValues.userName,
            "password": formValues.password,
            "phoneNumber": formValues.phoneNumber,
            "telephoneNumber": formValues.telephoneNumber,
            "address": formValues.address,
            "maritalStatus": formValues.maritalStatus,
            "workPlaceName": formValues.workPlaceName,
            "occupation": formValues.occupation,
            "officeAddress": formValues.officeAddress,
            "schoolDetails": formValues.schoolDetails,
            "clubDetails": formValues.clubDetails,
            "paymentDetails": formValues.paymentDetails[0],
            "gallery": [
                1,
                2,
                3
            ],
            "isSchoolDetailVerified": false,
            "isPaymentDetailVerified": false,
            "memberApprovalStatus": "APPROVED",
            "membershipId": "",
            "declinedMessage": ""
        }
        try {
            // Call the addMember function
            await addMember(data);
            // Call your success function here if needed
        } catch (error) {
            // Handle error if needed
        } finally {
            // Set loading state back to false, whether the request succeeds or fails
            setLoading(false);
        }

        // const addMember = async (data: MemberData): Promise<AxiosResponse<any>> => {
        //     try {
        //       const response = await axios.post('http://localhost:3000/api/member', data);
        //       console.log('Member added successfully:', response.data);
        //       sucessForm()
        //       return response;
        //     } catch (error) {
        //       console.error('Error adding member:', error);
        //       throw error;
        //     }
        //   };
    }
    const addSchool = () => {
        let schoolDetail: SchoolDetail = {
            "schoolName": formValues.sdschoolName,
            "participated": formValues.sdparticipated,
            "game": formValues.sdgame,
            "from": formValues.sdfrom,
            "to": formValues.sdto,
            "role": formValues.sdrole
        }
        setFormValues((prevValues) => ({
            ...prevValues,
            schoolDetails: [...prevValues.schoolDetails, schoolDetail],
        }));
    }
    const addClub = () => {
        let clbdetails: ClubDetail = {
            "clubName": formValues.cdclubName,
            "invloved": formValues.cdinvloved,
            "game": formValues.cdgame,
            "from": formValues.cdfrom,
            "to": formValues.cdto,
            "role": formValues.cdrole,
        }
        setFormValues((prevValues) => ({
            ...prevValues,
            clubDetails: [...prevValues.clubDetails, clbdetails],
        }));
    }
    const addPayment = () => {
        let paydetails: PaymentDetails = {
            "memberId": formValues.pdcategory,
            "bank": formValues.pdbank,
            "branch": formValues.pdbranch,
            "total": formValues.pdtotal,
            "date": formValues.pddate,
            "paymentSlip": formValues.pdpaymentImage
        }
        setFormValues((prevValues) => ({
            ...prevValues,
            paymentDetails: [...prevValues.paymentDetails, paydetails],
        }));
    }
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        var base64String = ""
        if (file) {
            base64String = await convertFileToBase64(file);
        }
        const newPaymentDetail: PaymentDetails = {
            memberId: formValues.pdcategory,
            bank: formValues.pdbank,
            branch: formValues.pdbranch,
            total: formValues.pdtotal,
            date: formValues.pddate,
            paymentSlip: base64String,
        };

        setFormValues((prevValues) => ({
            ...prevValues,
            paymentDetails: [
                {
                    ...prevValues.paymentDetails[0], // Preserve other properties
                    ...newPaymentDetail, // Update specific properties
                },
                ...prevValues.paymentDetails.slice(1), // Keep the rest of the array
            ],
        }));
    };
    const handleImageChange2 = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        var base64String = ""
        if (file) {
            base64String = await convertFileToBase64(file);
        }
        setFormValues((prevValues) => ({
            ...prevValues,
            profilePicture: base64String,
        }));

    };
// Array of options for the select box

const options = ['Ordinary Member', 'Life time Member', 'Hon Life time Member'];
const options2 = ['MR', 'MS', 'MRS'];
const handleSelectChange2 = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormValues((prevValues) => ({
        ...prevValues,
        title:  event.target.value,
    }));
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormValues((prevValues) => ({
        ...prevValues,
        category:  event.target.value,
    }));
  };
  
  const handleSchoolCheckboxChange = () => {
    console.log(formValues.isPaymentDetailVerified);
    setIsSclChecked(!isSclChecked)
    setFormValues((prevValues) => ({
        ...prevValues,
        isSchoolDetailVerified:  !isSclChecked,
    }));
  };
  const handlePaymentCheckboxChange = () => {
    setIsPayChecked(!ispayChecked)
    setFormValues((prevValues) => ({
        ...prevValues,
        isPaymentDetailVerified:!ispayChecked  ,
    })); 
 };
    return (
        <div className="mb-5 space-y-5">

            <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex flex-col sm:flex-row items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
                <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
                    <div className="space-y-2 prose dark:prose-headings:text-white-dark mt-10 mb-10">
                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                            Add New Member
                        </h1>
                    </div>
                </div>
            </div>

            <div className="flex flex-col space-y-5 sm:flex-row sm:space-y-0 sm:space-x-5">
                <div className="max-w-[60rem] w-full bg-[#e2e2e7] shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none" style={{ borderRadius: '30px' }}>
                    <div className="p-5 sm:p-10 flex flex-col sm:flex-row items-center">
                        <div className="w-60 h-60 rounded-md overflow-hidden object-cover mb-5 sm:mb-0">
                            <img
                                src="/assets/images/profile-34.jpeg"
                                alt="profile"
                                className="w-full h-full object-cover"
                                style={{ borderRadius: '30px' }}
                            />
                        </div>
                        <div className="text-center sm:text-left ml-10 mr-5">
                            <h3 className="text-[#3b3f5c] text-2xl sm:text-4xl font-semibold mb-2 dark:text-black bold">
                                Luke Ivory
                            </h3>
                            <p className="mb-2 text-lg sm:text-xl text-dark">
                                Membership Type - {formValues.category}
                            </p>
                            <p className="mb-2 text-lg sm:text-xl text-dark">
                                Status - Pending Request
                            </p>
                            <p className="mb-2 text-lg sm:text-xl text-dark">
                                Member Request -{currentDateTime}
                            </p>
                            <p className="mb-2 text-lg sm:text-xl text-dark">
                                Membership Approval Date - Not Approved Yet
                            </p>
                            <p className="mb-2 text-lg sm:text-xl text-dark">
                                Membership ID - Not Assigned Yet
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-[40rem] w-full bg-[#e2e2e7] shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none" style={{ borderRadius: '30px' }}>
                    <div className="p-5 sm:p-10 flex flex-col sm:flex-row items-center">
                        <div className="text-center sm:text-left mr-5">
                            <h3 className="text-[#3b3f5c] text-2xl sm:text-4xl font-semibold mb-2 dark:text-black bold">
                                Verification Process
                            </h3>

                            <label className="inline-flex mt-5 text-xl">
                                <span className="peer-checked:text-success">School and Club Details</span>
                                <input onChange={handleSchoolCheckboxChange} checked={formValues.isSchoolDetailVerified}  type="checkbox" className="form-checkbox text-success border-white peer ml-5" />
                            </label>
                            <label className="inline-flex mt-5 ml-10 text-xl">
                                <span className="peer-checked:text-success">Payment Details</span>
                                <input onChange={handlePaymentCheckboxChange} checked={formValues.isPaymentDetailVerified} type="checkbox" className="form-checkbox text-success border-white peer ml-5" />
                            </label>
                            <form className="space-y-5 mt-5">
                                <div className="sm:flex justify-between items-center md:gap-20">
                                    <label htmlFor="hrLargeinput" className="w-full sm:w-auto text-2xl">Membership Id</label>
                                    <input id="hrLargeinput" type="text" placeholder="JSSC000458" className="w-full sm:w-1/2 form-input text-2xl" />
                                </div>
                            </form>

                            <div className="flex mt-5 ml-5 justify-center">
                                <button onClick={handleSubmit} type="button" className="btn btn-outline-success rounded-full ml-5 text-2xl">
                                {Loading ? 'Loading...' : "Approve"}

                                    </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>


            {/* Body Start */}

            <div>

                <div className="pt-5">

                    <div>
                        <ul className="sm:flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 whitespace-nowrap overflow-y-auto">
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('home')}
                                    className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'home' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconUser />
                                    Personal Information
                                </button>
                            </li>
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('occupation')}
                                    className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'occupation' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconLaptop />
                                    Occupation Information
                                </button>
                            </li>
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('clubs')}
                                    className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'clubs' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconAt />
                                    School and Clubs
                                </button>
                            </li>
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('payment-details')}
                                    className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'payment-details' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconDollarSignCircle />
                                    Payment Details
                                </button>
                            </li>

                        </ul>
                    </div>
                    {tabs === 'home' ? (
                        <div>
                            <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black" onSubmit={(e) => { e.preventDefault(); submitForm(); }}>
                                <h6 className="text-lg font-bold mb-5">Select Category</h6>
                                <div className="flex flex-col sm:flex-row">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-5">
                                        <div>
                                            <label htmlFor="name">Category</label>
                                          
                                            <CustomSelect options={options} value={formValues.category} onChange={handleSelectChange} />
                                                                                    </div>
                                    </div>
                                </div>
                                <h6 className="text-lg font-bold mb-5 mt-5">Personal Information</h6>
                                <div className="flex flex-col sm:flex-row">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-5">
                                        <div>
                                            <label htmlFor="name">User Name</label>
                                            <input onChange={handleChange} name='userName' value={formValues.userName} id="name" type="text" placeholder="Jimmy Turner" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="title">Title</label>
                                            <CustomSelect options={options2} value={formValues.title} onChange={handleSelectChange2} />

                                            {/* <select defaultValue="mr" id="title" className="form-select text-black rounded-full border-dark" required >
                                                <option value="mr">Mr</option>
                                                <option value="ms">Ms</option>
                                                <option value="mrs">Mrs</option>
                                            </select> */}
                                        </div>
                                        <div>
                                            <label htmlFor="name">First Name</label>
                                            <input id="name" onChange={handleChange} name='firstName' value={formValues.firstName} type="text" placeholder="Jimmy Turner" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="name">Last Name</label>
                                            <input onChange={handleChange} name='lastName' value={formValues.lastName} id="name" type="text" placeholder="Jimmy Turner" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="profession">Date of birth</label>
                                            <input onChange={handleChange} name='dateOfBirth' value={formValues.dateOfBirth} id="profession" type="date" placeholder="Web Developer" className="form-input rounded-full border-dark" required />
                                        </div>

                                        <div>
                                            <label htmlFor="address">NIC/Passport Id</label>
                                            <input onChange={handleChange} name='passportNumber' value={formValues.passportNumber} id="address" type="text" placeholder="New York" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="email">Email</label>
                                            <input onChange={handleChange} name='email' value={formValues.email} id="email" type="email" placeholder="Jimmy@gmail.com" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="phone">phoneNumber Number</label>
                                            <input onChange={handleChange} name='phoneNumber' value={formValues.phoneNumber} id="phone" type="tel" placeholder="+1 (530) 555-12121" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="phone">Telephone Number</label>
                                            <input onChange={handleChange} name='telephoneNumber' value={formValues.telephoneNumber} id="phone" type="text" placeholder="+1 (530) 555-12121" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="location">Resident Address</label>
                                            <input onChange={handleChange} name='address' value={formValues.address} id="location" type="text" placeholder="Location" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="web">Marital Status</label>
                                            <input onChange={handleChange} name='maritalStatus' value={formValues.maritalStatus} id="web" type="text" placeholder="Enter URL" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="name">Password</label>
                                            <input onChange={handleChange} name='password' value={formValues.password} id="name" type="text" placeholder="Jimmy Turner" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="name">Confirm Password</label>
                                            <input onChange={handleChange} name='confirmPassword' value={formValues.confirmPassword} id="name" type="text" placeholder="Jimmy Turner" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="name">Profile Picture</label>
                                            <input type="file" accept="image/*" onChange={handleImageChange2} />

                                            {/* <input id="name" type="file" placeholder="Jimmy Turner" className="form-input rounded-full border-dark" required /> */}
                                        </div>

                                    </div>
                                </div>

                            </form>
                        </div>
                    ) : (
                        ''
                    )}
                    {tabs === 'payment-details' ? (
                        <div>
                            <div className="space-y-2 prose dark:prose-headings:text-white-dark mt-10 mb-10">
                                <h2>
                                    Payment Details
                                </h2>

                            </div>


                            <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black" onSubmit={(e) => { e.preventDefault(); submitForm(); }}>

                                <div className="flex flex-col sm:flex-row">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-5">
                                        <div>
                                            <label htmlFor="profession">Category</label>
                                            <input onChange={handleChange} name='pdcategory' value={formValues.pdcategory} id="profession" type="text" placeholder="Web Developer" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="name">Bank</label>
                                            <input onChange={handleChange} name='pdbank' value={formValues.pdbank} id="name" type="text" placeholder="Jimmy Turner" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="name">Branch</label>
                                            <input onChange={handleChange} name='pdbranch' value={formValues.pdbranch} id="name" type="text" placeholder="Jimmy Turner" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="profession">Total</label>
                                            <input onChange={handleChange} name='pdtotal' value={formValues.pdtotal} id="profession" type="text" placeholder="Web Developer" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="name">Date</label>
                                            <input onChange={handleChange} name='pddate' value={formValues.pddate} id="name" type="text" placeholder="Jimmy Turner" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="name">Payment Image</label>
                                            <input type="file" accept="image/*" onChange={handleImageChange} />

                                            {/* <input  onChange={handleChange} name='pdpaymentImage' value={formValues.pdpaymentImage} id="name" type="File" placeholder="Jimmy Turner" className="form-input rounded-full border-dark" required /> */}
                                        </div>

                                    </div>
                                </div>
                                <div className="sm:col-span-2 mt-6 align-center flex justify-center"  >
                                    <button type="submit" className="btn btn-outline-primary rounded-full" onClick={addPayment}  >
                                        Add Payment
                                    </button>
                                </div>
                            </form>

                            <div className="table-responsive mb-5">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Member Type</th>
                                            <th>Bank</th>
                                            <th>Branch</th>
                                            <th>Total</th>
                                            <th>Date</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {formValues && formValues.paymentDetails && formValues.paymentDetails.map((data, index) => {
                                            return (
                                                <tr key={index + 1}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div className="whitespace-nowrap">{data.memberId}</div>
                                                    </td>
                                                    <td>
                                                        <div className="whitespace-nowrap">{data.bank}</div>
                                                    </td>
                                                    <td>{data.branch}</td>
                                                    <td>{data.total}</td>
                                                    <td>{data.date}</td>
                                                    <td><button className="badge whitespace-nowrap badge-outline-primary"
                                                    >
                                                        View Image
                                                    </button>
                                                    </td>

                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div></div>

                    ) : (
                        ''
                    )}
                    {tabs === 'occupation' ? (
                        <div>
                            <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black" onSubmit={(e) => { e.preventDefault(); submitForm(); }}>
                                <h6 className="text-lg font-bold mb-5">Occupation Information</h6>
                                <div className="flex flex-col sm:flex-row">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-5">

                                        <div>
                                            <label htmlFor="name">Workplace Name</label>
                                            <input onChange={handleChange} name='workPlaceName' value={formValues.workPlaceName} id="name" type="text" placeholder="Jimmy Turner" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="name">Occupation</label>
                                            <input onChange={handleChange} name='occupation' value={formValues.occupation} id="name" type="text" placeholder="Jimmy Turner" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="profession">Office Address</label>
                                            <input onChange={handleChange} name='officeAddress' value={formValues.officeAddress} id="profession" type="text" placeholder="Web Developer" className="form-input rounded-full border-dark" required />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    ) : (
                        ''
                    )}
                    {tabs === 'clubs' ? (
                        <div>
                            <div className="space-y-2 prose dark:prose-headings:text-white-dark mt-10 mb-10">
                                <h2>
                                    School Details
                                </h2>

                            </div>

                            <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black" onSubmit={(e) => { e.preventDefault(); submitForm(); }}>

                                <div className="flex flex-col sm:flex-row">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-5">
                                        <div>
                                            <label htmlFor="name">School Name</label>
                                            <input onChange={handleChange} name='sdschoolName' value={formValues.sdschoolName} id="name" type="text" placeholder="Jimmy Turner" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="name">Team you played</label>
                                            <input onChange={handleChange} name='sdparticipated' value={formValues.sdparticipated} id="name" type="text" placeholder="Jimmy Turner" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="profession">Game</label>
                                            <input onChange={handleChange} name='sdgame' value={formValues.sdgame} id="profession" type="text" placeholder="Web Developer" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="name">From</label>
                                            <input onChange={handleChange} name='sdfrom' value={formValues.sdfrom} id="name" type="text" placeholder="Jimmy Turner" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="name">To</label>
                                            <input onChange={handleChange} name='sdto' value={formValues.sdto} id="name" type="text" placeholder="Jimmy Turner" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="profession">Role</label>
                                            <input onChange={handleChange} name='sdrole' value={formValues.sdrole} id="profession" type="text" placeholder="Web Developer" className="form-input rounded-full border-dark" required />
                                        </div>
                                    </div>
                                </div>
                                <div className="sm:col-span-2 mt-6 align-center flex justify-center"   >
                                    <button type="submit" className="btn btn-outline-primary rounded-full" onClick={addSchool}>
                                        Add School
                                    </button>
                                </div>
                            </form>

                            <div className="table-responsive mb-5">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>School Name</th>
                                            <th>Team Played</th>
                                            <th>Game</th>
                                            <th>From</th>
                                            <th>To</th>
                                            <th>Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formValues && formValues.schoolDetails && formValues.schoolDetails.map((data, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div className="whitespace-nowrap">{data.schoolName}</div>
                                                    </td>
                                                    <td>
                                                        <div className="whitespace-nowrap">{data.participated}</div>
                                                    </td>
                                                    <td>{data.game}</td>
                                                    <td>{data.from}</td>
                                                    <td>{data.to}</td>
                                                    <td>{data.role}</td>

                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>


                            <div className="space-y-2 prose dark:prose-headings:text-white-dark mt-10 mb-10">
                                <h2>
                                    Club Details
                                </h2>

                            </div>

                            <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black" onSubmit={(e) => { e.preventDefault(); submitForm(); }}>

                                <div className="flex flex-col sm:flex-row">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-5">

                                        <div>
                                            <label htmlFor="name">Club Name</label>
                                            <input onChange={handleChange} name='cdclubName' value={formValues.cdclubName} id="name" type="text" placeholder="Jimmy Turner" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="name">Team you played</label>
                                            <input onChange={handleChange} name='cdinvloved' value={formValues.cdinvloved} id="name" type="text" placeholder="Jimmy Turner" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="profession">Game</label>
                                            <input onChange={handleChange} name='cdgame' value={formValues.cdgame} id="profession" type="text" placeholder="Web Developer" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="name">From</label>
                                            <input onChange={handleChange} name='cdfrom' value={formValues.cdfrom} id="name" type="text" placeholder="Jimmy Turner" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="name">To</label>
                                            <input onChange={handleChange} name='cdto' value={formValues.cdto} id="name" type="text" placeholder="Jimmy Turner" className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="profession">Role</label>
                                            <input onChange={handleChange} name='cdrole' value={formValues.cdrole} id="profession" type="text" placeholder="Web Developer" className="form-input rounded-full border-dark" required />
                                        </div>
                                    </div>
                                </div>
                                <div className="sm:col-span-2 mt-6 align-center flex justify-center"   >
                                    <button type="submit" className="btn btn-outline-primary rounded-full"onClick={addClub} >
                                        Add Club
                                    </button>
                                </div>
                            </form>

                            <div className="table-responsive mb-5">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Club Name</th>
                                            <th>Team Played</th>
                                            <th>Game</th>
                                            <th>From</th>
                                            <th>To</th>
                                            <th>Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formValues && formValues.clubDetails && formValues.clubDetails.map((data, index) => {
                                            return (
                                                <tr key={index + 1}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div className="whitespace-nowrap">{data.clubName}</div>
                                                    </td>
                                                    <td>
                                                        <div className="whitespace-nowrap">{data.invloved}</div>
                                                    </td>
                                                    <td>{data.game}</td>
                                                    <td>{data.from}</td>
                                                    <td>{data.to}</td>
                                                    <td>{data.role}</td>

                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>


                        </div>
                    ) : (
                        ''
                    )}

                </div>
            </div>

            {/* Body End */}

            {/* <div className="sm:col-span-2 mt-6"  >
                <button type="submit" className="btn btn-outline-primary rounded-full" onClick={handleSubmit} >
                    {Loading ? 'Loading...' : "Add Member"}


                </button>
            </div> */}


        </div>




    );
};

export default AddNewMember;
