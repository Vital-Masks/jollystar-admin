import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import Tippy from '@tippyjs/react';
import React, { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconUsersGroup from '../../components/Icon/IconUsersGroup';
import IconThumbUp from '../../components/Icon/IconThumbUp';
import IconTrash from '../../components/Icon/IconTrash';
import IconFolderPlus from '../../components/Icon/IconFolderPlus';
import IconNotesEdit from '../../components/Icon/IconNotesEdit';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
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
import IconEdit from '../../components/Icon/IconEdit';
import axios from 'axios';
import Popover from '@mui/material/Popover';
interface PaymentDetail {

    memberId?: string;
    bank?: string;
    branch?: string;
    total?: string;
    date?: string;
    paymentSlip?: string;
}
interface Member {
    data: Member | (() => Member);
    paymentDetails?: PaymentDetail[];
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
    isSchoolDetailVerified?: boolean;
    isPaymentDetailVerified?: boolean;
    membershipId?: string;
    declinedMessage?: string;
    created_at?: string;
}

interface PaymentDetails {
    memberId: string;
    bank: string;
    branch: string;
    total: string;
    date: string;
    paymentSlip: string;
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


interface GalleryItem {
    // Define the properties of your gallery item
}
interface FormValues {
    isSchoolDetailVerified: boolean;
    isPaymentDetailVerified: boolean;
}
interface ViewAllStatusMemberProps {
    data: Member[]; // Assuming Member is a type representing your data structure
}
const ViewAllStatusMember: React.FC<Member> = ({ data }) => {

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const [members, setMembers] = useState<Member>(data);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    // 
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { memberId } = useParams();
    const [isSclChecked, setIsSclChecked] = useState(true);
    const [ispayChecked, setIsPayChecked] = useState(true);

    const [removeLoading, setRemoveLoading] = useState(false)
    const [approveLoading, setApproveLoading] = useState(false)
    const [memberIdErrorMsg, setMemberIdErrorMsg] = useState("")

    const [formValues, setFormValues] = useState<FormValues>({
        isSchoolDetailVerified: isSclChecked,
        isPaymentDetailVerified: ispayChecked,
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
        dispatch(setPageTitle('Approved Members'));

        // fetch(`http://localhost:3000/api/member/memberPayment/${memberId}`)
        //     .then(response => response.json())
        //     .then(data => {
        //         if (data.result) {
        //             setMembers(data.result[0]);
        //         }
        //     })
        //     .catch(error => console.error('Error fetching data:', error));

    }, [dispatch, memberId, data]);

    const [tabs, setTabs] = useState('home');

    const toggleTabs = (name: string) => {
        setTabs(name);
    };

    const items = ['carousel1.jpeg', 'carousel2.jpeg', 'carousel3.jpeg'];

    const tableData = [
        {
            id: 1,
            firstname: 'John',
            lastname: 'Doe',
            membershiptype: 'johndoe',
            dateapplied: '10/08/2020',
            nic: '954646466V',
            mobile: '073777777777',
        }
    ];
    const hableRemove = () => {

        setRemoveLoading(true);
        handleStatus("REMOVED")

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
            setRemoveLoading(false)
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
                            <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                                <h6 className="text-lg font-bold mb-5">Personal Information</h6>
                                <div className="flex flex-col sm:flex-row">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-5">
                                        <div>
                                            <label htmlFor="name">User Name</label>
                                            <input id="name" type="text" value={members?.userName} className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="name">Title</label>
                                            <input id="name" type="text" value={members?.title} className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="name">First Name</label>
                                            <input id="name" type="text" value={members?.firstName} className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="name">Last Name</label>
                                            <input id="name" type="text" value={members?.lastName} className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="profession">Date of birth</label>
                                            <input id="profession" type="date" value={members?.dateOfBirth} className="form-input rounded-full border-dark" required />
                                        </div>

                                        <div>
                                            <label htmlFor="address">NIC/Passport Id</label>
                                            <input id="address" type="text" value={members?.passportNumber} className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="email">Email</label>
                                            <input id="email" type="email" value={members?.email} className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="phone">Mobile Number</label>
                                            <input id="phone" type="tel" value={members?.phoneNumber} className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="phone">Telephone Number</label>
                                            <input id="phone" type="text" value={members?.telephoneNumber} className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="location">Resident Address</label>
                                            <input id="location" type="text" value={members?.address} className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="web">Marital Status</label>
                                            <input id="web" type="text" value={members?.maritalStatus} className="form-input rounded-full border-dark" required />
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
                                        {/* {members && members.schoolDetails && members.schoolDetails.length > 0 && ( */}
                                        {members && members.paymentDetails && members.paymentDetails.filter(data => Object.keys(data).length !== 0).map((data, index) => {
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
                                                    <td>
                                                        {data.paymentSlip ?
                                                            <>
                                                                <button
                                                                    aria-describedby={id} onClick={handleClick}
                                                                    className="badge whitespace-nowrap badge-outline-primary"
                                                                >


                                                                    View Image
                                                                </button>
                                                                <Popover
                                                                    id={id}
                                                                    open={open}
                                                                    anchorEl={anchorEl}
                                                                    onClose={handleClose}
                                                                    anchorOrigin={{
                                                                        vertical: 'bottom',
                                                                        horizontal: 'left',
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={`data:image/png;base64,${data.paymentSlip}`}
                                                                        alt="Mountain"
                                                                        className='w-full'
                                                                    />
                                                                </Popover>
                                                            </>
                                                            : <>
                                                                <button
                                                                    className="badge whitespace-nowrap badge-outline-primary"
                                                                >


                                                                    No Image
                                                                </button>
                                                            </>
                                                        }
                                                    </td>

                                                </tr>
                                            );
                                        })}
                                        {/* {tableData.map((data) => {
                                            return (
                                                <tr key={data.id}>
                                                    <td>{data.id}</td>
                                                    <td>
                                                        <button
                                                            className="badge whitespace-nowrap badge-outline-primary"
                                                            
                                                        // Add onClick handler or link to view image
                                                        >
                                                            View Image
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <div className="whitespace-nowrap">{data.lastname}</div>
                                                    </td>
                                                    <td>{data.membershiptype}</td>
                                                    <td>{data.dateapplied}</td>
                                                    <td>{data.nic}</td>
                                                    <td>
                                                        <Popover
                                                            id={id}
                                                            open={open}
                                                            anchorEl={anchorEl}
                                                            onClose={handleClose}
                                                            anchorOrigin={{
                                                                vertical: 'bottom',
                                                                horizontal: 'left',
                                                            }}
                                                        >
                                                            <img
                                                                src={`data:image/png;base64,${data.paymentSlip}`}
                                                                alt="Mountain"
                                                                className='w-full'
                                                            />
                                                        </Popover>
                                                    </td>

                                                </tr>
                                            );
                                        })} */}
                                    </tbody>
                                </table>
                            </div></div>

                    ) : (
                        ''
                    )}
                    {tabs === 'occupation' ? (
                        <div>
                            <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                                <h6 className="text-lg font-bold mb-5">Occupation Information</h6>
                                <div className="flex flex-col sm:flex-row">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-5">

                                        <div>
                                            <label htmlFor="name">Workplace Name</label>
                                            <input id="name" type="text" value={members?.workPlaceName} className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="name">Occupation</label>
                                            <input id="name" type="text" value={members?.occupation} className="form-input rounded-full border-dark" required />
                                        </div>
                                        <div>
                                            <label htmlFor="profession">Office Address</label>
                                            <input id="profession" type="text" value={members?.officeAddress} className="form-input rounded-full border-dark" required />
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

                            {members && members.schoolDetails && members.schoolDetails.length > 0 && (
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
                                            {members.schoolDetails.map((data, index) => (
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

                                            ))}
                                        </tbody>
                                    </table>
                                </div>)}


                            <div className="space-y-2 prose dark:prose-headings:text-white-dark mt-10 mb-10">
                                <h2>
                                    Club Details
                                </h2>

                            </div>
                            {members && members.clubDetails && members.clubDetails.length > 0 && (
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
                                            {members.clubDetails.map((data, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div className="whitespace-nowrap">{data.clubName}</div>
                                                    </td>
                                                    <td>
                                                        <div className="whitespace-nowrap">{data.involved}</div>
                                                    </td>
                                                    <td>{data.game}</td>
                                                    <td>{data.from}</td>
                                                    <td>{data.to}</td>
                                                    <td>{data.role}</td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>)}

                            <div className="space-y-2 prose dark:prose-headings:text-white-dark mt-10 mb-10">
                                <h2>
                                    Proof Images
                                </h2>

                            </div>

                            {/* Images */}
                            <div className="swiper" id="slider5">
                                <div className="swiper-wrapper">
                                    <Swiper
                                        modules={[Navigation, Pagination]}
                                        navigation={{
                                            nextEl: '.swiper-button-next-ex5',
                                            prevEl: '.swiper-button-prev-ex5',
                                        }}
                                        pagination={{
                                            clickable: true,
                                        }}
                                        breakpoints={{
                                            1024: {
                                                slidesPerView: 3,
                                                spaceBetween: 30,
                                            },
                                            768: {
                                                slidesPerView: 2,
                                                spaceBetween: 40,
                                            },
                                            320: {
                                                slidesPerView: 1,
                                                spaceBetween: 20,
                                            },
                                        }}
                                        dir={themeConfig.rtlClass}
                                        key={themeConfig.rtlClass === 'rtl' ? 'true' : 'false'}
                                    >
                                        {members && members.gallery && members.gallery.length > 0 && members.gallery.map((item, i) => {
                                            return (
                                                <SwiperSlide key={i}>


                                                    <img
                                                        src={`${item}`}
                                                        alt="profile"
                                                        className="w-full"
                                                        style={{maxWidth:"200px"}}
                                                    />
                                                    {/* <img src={`/assets/images/${item}`} className="w-full" alt="itemImg" /> */}
                                                </SwiperSlide>

                                            );
                                        })}
                                      
                                    </Swiper>
                                </div>
                            </div>

                        </div>
                    ) : (
                        ''
                    )}
                </div>
            </div>

            {/* Body End */}







        </div>



    );
};

export default ViewAllStatusMember;
