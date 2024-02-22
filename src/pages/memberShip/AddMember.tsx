import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconUsersGroup from '../../components/Icon/IconUsersGroup';
import IconThumbUp from '../../components/Icon/IconThumbUp';
import IconTrash from '../../components/Icon/IconTrash';
import IconFolderPlus from '../../components/Icon/IconFolderPlus';
import IconNotesEdit from '../../components/Icon/IconNotesEdit';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import IconPlus from '../../components/Icon/IconPlus';
import IconHome from '../../components/Icon/IconHome';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import IconPhone from '../../components/Icon/IconPhone';
import IconLinkedin from '../../components/Icon/IconLinkedin';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconFacebook from '../../components/Icon/IconFacebook';
import IconGithub from '../../components/Icon/IconGithub';
import IconUser from '../../components/Icon/IconUser';
import IconLaptop from '../../components/Icon/IconLaptop';
import IconPlayCircle from '../../components/Icon/IconPlayCircle';
import IconAt from '../../components/Icon/IconAt';
import Swal from 'sweetalert2';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper';
import themeConfig from '../../theme.config';
import { useParams } from 'react-router-dom';
import mongoose from 'mongoose';
import axios from 'axios';
import ViewAllMemberProfile from './ViewAllMemberProfile';
import ViewAllStatusMember from '../../components/memberShip/viewAllMemberDatas';
// import ViewAllStatusMember from './viewAllMemberDatas';

interface Member {
    data: Member | (() => Member);
    _id: string;
    profilePicture: object;
    firstName?: string;
    lastName?: string;
    membershipCategory: string;
    updated_at: string;
    passportNumber: string;
    phoneNumber: string;
    memberApprovalStatus: string;
    title?: string;
    dateOfBirth?: string;
    email?: string;
    userName?: string;
    password?: string;
    telephoneNumber?: string;
    address?: string;
    maritalStatus?: string;
    workPlaceName?: string;
    occupation?: string;
    officeAddress?: string;
    schoolDetails?: SchoolDetail[];
    clubDetails?: ClubDetail[];
    gallery?: GalleryItem[];
    paymentDetails?: PaymentDetail[];
    isSchoolDetailVerified?: boolean;
    isPaymentDetailVerified?: boolean;
    membershipId?: string;
    declinedMessage?: string;
    created_at?: string;
}

interface SchoolDetail {
    schoolName?: string;
    participated?: string;
    game?: string;
    from?: string;
    to?: string;
    role?: string;
}

interface ClubDetail {
    clubName?: string;
    involved?: string;
    game?: string;
    from?: string;
    to?: string;
    role?: string;
}
interface PaymentDetail {
    paymentCategory: string;
    memberId: number;
    bank: string;
    branch: string;
    total: number;
    date: string;
}
interface GalleryItem {
    // Define the properties of your gallery item
}
interface FormValues {
    memberID: string;
    isSchoolDetailVerified: boolean;
    isPaymentDetailVerified: boolean;
}
const AddMember = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [members, setMembers] = useState<Member>();
    const { memberId } = useParams();

    const [isSclChecked, setIsSclChecked] = useState(true);
    const [ispayChecked, setIsPayChecked] = useState(true);

    const [declineLoading, setDeclineLoading] = useState(false)
    const [approveLoading, setApproveLoading] = useState(false)
    const [memberIdErrorMsg, setMemberIdErrorMsg] = useState("")

    const [formValues, setFormValues] = useState<FormValues>({
        isSchoolDetailVerified: isSclChecked,
        isPaymentDetailVerified: ispayChecked,
        memberID: ""
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'memberID') {
            setMemberIdErrorMsg("")

        }
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };
    const handleSchoolCheckboxChange = () => {
        console.log(formValues.isPaymentDetailVerified);
        setIsSclChecked(!isSclChecked)
        setFormValues((prevValues) => ({
            ...prevValues,
            isSchoolDetailVerified: !isSclChecked,
        }));
    };
    const handlePaymentCheckboxChange = () => {
        setIsPayChecked(!ispayChecked)
        setFormValues((prevValues) => ({
            ...prevValues,
            isPaymentDetailVerified: !ispayChecked,
        }));
    };

    useEffect(() => {
        dispatch(setPageTitle('AddMember Admin'));

        fetch(`http://localhost:3000/api/member/memberPayment/${memberId}`)
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    setMembers(data.result[0]);
                }
            })
            .catch(error => console.error('Error fetching data:', error));

    }, [dispatch, memberId]);

    const [tabs, setTabs] = useState('home');

    const toggleTabs = (name: string) => {
        setTabs(name);
    };

    const items = ['carousel1.jpeg', 'carousel2.jpeg', 'carousel3.jpeg'];
    const handleApprove = () => {
        if (formValues.memberID !== "") {
            setApproveLoading(true);
            handleStatus("APPROVED")

        } else {
            setMemberIdErrorMsg("Required")
        }

    }

    const handleDecline = () => {

        if (formValues.memberID !== "") {
            setDeclineLoading(true);
            handleStatus("DECLINED")
        } else {
            setMemberIdErrorMsg("Required")
        }

    }
    const handleStatus = async (status: string) => {
        let data = {
            "memberApprovalStatus": status.toUpperCase(),
            "declinedMessage": "wrong info"
        }
        console.log(status);
        try {

            const response = await axios.put(`http://localhost:3000/api/member/memberApproval/${memberId}`, data
            );
            // Handle the response as needed
            console.log('PUT request successful:', response.data);
            alertForm1("Sucessfully " + status, "")
            navigate(-1);

        } catch (error) {
            // Handle errors
            console.error('Error:', error);
            alertForm1(status + " Failed", "error")
        } finally {
            setApproveLoading(false);
            setDeclineLoading(false)
        }

    }

    const alertForm1 = (msg: string, error: string) => {

        const toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
        });
        toast.fire({
            icon: error === "error" ? "error" : "success",
            title: msg,
            padding: '10px 20px',
        });
    };

    return (
        <div className="mb-5 space-y-5">

            <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex flex-col sm:flex-row items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
                <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
                    <div className="space-y-2 prose dark:prose-headings:text-white-dark mt-10 mb-10">
                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                            Membership Requests
                        </h1>
                    </div>
                </div>
            </div>


            <div className="flex flex-col space-y-5 sm:flex-row sm:space-y-0 sm:space-x-5">
                {
                    members &&
                    <ViewAllMemberProfile data={members} />
                }

                {/* start tickbox */}
                {members && <div className="max-w-[40rem] w-full bg-[#e2e2e7] shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none" style={{ borderRadius: '30px' }}>
                    <div className="p-5 sm:p-10 flex flex-col sm:flex-row items-center">
                        <div className="text-center sm:text-left mr-5">
                            <h3 className="text-[#3b3f5c] text-2xl sm:text-4xl font-semibold mb-2 dark:text-black bold">
                                Verification Process
                            </h3>

                            <label className="inline-flex mt-5 text-xl">
                                <span className="peer-checked:text-success">School and Club Details</span>
                                <input onChange={handleSchoolCheckboxChange} checked={formValues.isSchoolDetailVerified} type="checkbox" className="form-checkbox text-success border-white peer ml-5" />
                            </label>
                            <label className="inline-flex mt-5 ml-10 text-xl">
                                <span className="peer-checked:text-success">Payment Details</span>
                                <input onChange={handlePaymentCheckboxChange} checked={formValues.isPaymentDetailVerified} type="checkbox" className="form-checkbox text-success border-white peer ml-5" />
                            </label>
                            <form className="space-y-5 mt-5">
                                <div className="sm:flex justify-between items-center md:gap-20">
                                    <label htmlFor="hrLargeinput" className="w-full sm:w-auto text-2xl">Membership Id</label>
                                    <div>
                                        <input onChange={handleChange} name="memberID" value={formValues.memberID} id="hrLargeinput" type="text" placeholder="JSSC000458" className="w-full sm:w-1/2 form-input text-2xl" />
                                        <p className="w-full sm:w-1/2 text-sm text-red-400 ps-4"  >{memberIdErrorMsg}</p>

                                    </div>
                                    {/* MemberIdErrorMsg */}
                                </div>
                            </form>


                            <div className="flex mt-5 ml-5 justify-center">
                                <button type="button" className="btn btn-outline-danger rounded-full text-2xl" onClick={handleDecline} >
                                    {declineLoading ? 'Loading...' : "Decline"}
                                </button>
                                <button type="button" className="btn btn-outline-success rounded-full ml-5 text-2xl" onClick={handleApprove}>{approveLoading ? 'Loading...' : "Approve"}</button>
                            </div>

                        </div>
                    </div>
                </div>}
            </div>


            {/* Body Start */}
            {
                members &&
                <ViewAllStatusMember data={members} />
            }

            {/* Body End */}







        </div>



    );
};

export default AddMember;
