import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Monitor,
  UserCheck,
  Zap,
  Building,
} from "lucide-react";

const WorkspaceType = ({ title, description, images, amenities }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex-1 p-4 border rounded-lg border-orange-200">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex items-center mb-4">
        <Clock size={16} className="mr-2" />
        <span className="text-sm">Depends on package</span>
      </div>
      <div className="relative mb-4">
        <img
          src={images[currentImage]}
          alt={title}
          className="w-full h-64 object-cover rounded-lg"
        />
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
        >
          <ChevronRight size={20} />
        </button>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentImage ? "bg-white" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>
      </div>
      <h3 className="font-bold mb-2">Utilities</h3>
      <div className="flex flex-wrap gap-2">
        {amenities.map((amenity, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
          >
            {amenity.icon}
            <span className="ml-2">{amenity.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const WorkspaceComparison = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const comparisons = [
    {
      standard: {
        title: "Standard Area",
        description:
          "The new workspace, available to Membership Standard members, is fully equipped and offers the privacy needed to work for long periods of time.",
        images: [
          "https://workflow.com.vn/wp-content/uploads/2024/07/b1f293e72e40e53c6d98a043c1cc3148.png",
          "https://workflow.com.vn/wp-content/uploads/2024/07/72d7d94d35b0d6bce9ae803e5e5b8975.png",
          "https://workflow.com.vn/wp-content/uploads/2024/07/174012d90de9e924e2192e3741ece56c-1.jpg",
        ],
        amenities: [
          { name: "High-end desk", icon: <Monitor size={16} /> },
          { name: "Ergonomic chair", icon: <UserCheck size={16} /> },
          { name: "Auto check-in.", icon: <Zap size={16} /> },
          { name: "Service Offers", icon: <Building size={16} /> },
          { name: "Common facilities", icon: <Building size={16} /> },
        ],
      },
      premium: {
        title: "Premium Area",
        description:
          "Premium Standard members' focused workspace with plenty of natural light and equipped with premium amenities.",
        images: [
          "https://workflow.com.vn/wp-content/uploads/2024/07/cb9919c99f173cf042d4e2a81fd5b031.jpg",
          "https://scontent.fhan3-3.fna.fbcdn.net/v/t39.30808-6/441397399_415513347919928_604910872180293785_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFECoT_zhG3d_I6ePeP2zoYRelxFgdlAdBF6XEWB2UB0NUnw_Kt5J0xk7takqSp1SUVEMBLWGOcq7osFw6zvuu9&_nc_ohc=5An2EqYzGpMQ7kNvgG6ORLg&_nc_zt=23&_nc_ht=scontent.fhan3-3.fna&_nc_gid=ACC77HGQ-I_NPdccq0GE_gs&oh=00_AYBjphqHK8QSBWnhZhHeeRRS-S2iLg6kVfFnIqmMYAq75w&oe=6712B40E",
"https://scontent.fhan3-4.fna.fbcdn.net/v/t39.30808-6/441371192_415513327919930_8085090554528087948_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEXbD92s2o4rVi9vp-wUEvIdt_FkiYI3QN238WSJgjdA9woXq2lCRPif_2s4falQQSnhhEvwOYpVZuzhHuwhL_t&_nc_ohc=xa7esPNCYlEQ7kNvgG6gogS&_nc_zt=23&_nc_ht=scontent.fhan3-4.fna&_nc_gid=AD7xDM4tdOAWFlStPB9UhTO&oh=00_AYCXOrvafcTu84tx52Zh6YOwPSVna8iz98wOk708Fp8FbQ&oe=6712C6C1",        ],
        amenities: [
          { name: "High-end desk", icon: <Monitor size={16} /> },
          { name: "Ergonomic chair", icon: <UserCheck size={16} /> },
          { name: "Auto check-in.", icon: <Zap size={16} /> },
          { name: "Service Offers", icon: <Building size={16} /> },
          { name: "Common facilities", icon: <Building size={16} /> },
        ],
      },
    },
    {
      standard: {
        title: "Coworking Area",
        description:
          "Flexible coworking space, suitable for small working groups or freelancers.",
        images: [
          "https://scontent.fhan3-3.fna.fbcdn.net/v/t39.30808-6/458766505_490850287052900_8927666875201488222_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFo_imDlUy-j_s4tWAyPAHE-3iluWwlWy_7eKW5bCVbL52pvHiFsiu-iq-aBAQl9wVuUCmRGRd9__RQ28yxf-9x&_nc_ohc=fJUBAKegwnAQ7kNvgHnAwSO&_nc_zt=23&_nc_ht=scontent.fhan3-3.fna&_nc_gid=AKBRwtXVMEv9zOcc0f6kC8l&oh=00_AYAslhpmh9-n_YMHJSR68JnGLh2TZ4pQhLeVYhkO5xKrzQ&oe=6712E18C",
          "https://scontent.fhan3-4.fna.fbcdn.net/v/t39.30808-6/460800040_499338269537435_3793387716923295037_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHe8GsXsH3pTCVBIpdvivdz3ExI1YaVEVLcTEjVhpURUjB7pRj4i2Jzn4io2c-DYIjQ9fGdZR_I2W2wuPwHVj7X&_nc_ohc=023RzCUnVS8Q7kNvgHOCkgZ&_nc_zt=23&_nc_ht=scontent.fhan3-4.fna&_nc_gid=AJeJNb0ArPYUug0W2VRUii7&oh=00_AYCqWJ5AB4Ymla-jAK2pVbfx0oVCVj1g_LijZzFbEXVUkQ&oe=6712D439",
          "https://scontent.fhan4-3.fna.fbcdn.net/v/t39.30808-6/460760738_499338202870775_4021142205269252800_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGAlkAtXNJzGYiy5OCv8kjK_ldBZSdkaXr-V0FlJ2Rpevui7YcyKQdZc0uzGeb-ureDoL5lowNYk2Dml6G1SYac&_nc_ohc=32ccHFSaMl8Q7kNvgFqu5iZ&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&_nc_gid=AO6zhFB3GK2SC4_LUjwUTbb&oh=00_AYBIi1MIAu7v9id0IE5zJXCdboSUkrexLTMRYD1-Cv9_xA&oe=6712D140",
        ],
        amenities: [
          { name: "Shared desk", icon: <Monitor size={16} /> },
          { name: "Meeting room", icon: <UserCheck size={16} /> },
          { name: "High speed wifi", icon: <Zap size={16} /> },
          { name: "Free coffee", icon: <Building size={16} /> },
        ],
      },
      premium: {
        title: "Private Office Area",
        description:
          "Private offices for small companies and startups, fully equipped.",
        images: [
          "https://ctfassets.imgix.net/vh7r69kgcki3/16pzkiIwrpItIJlic6zC9a/61f91981f872b1e0287420c553fbc649/Web_150DPI-WeWork_-_Lasalle_-_Chicago-1.jpg?auto=format%20compress&fit=crop&q=50&w=600&h=338",
          "https://scontent.fhan3-3.fna.fbcdn.net/v/t39.30808-6/456239374_479672844837311_8650304803946247848_n.jpg?stp=cp6_dst-jpg&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFEr6DdVXU6qtfqCUjsSJ0VY0o3DGPXnpJjSjcMY9eekkMpyN4bY6Cna34MjOpVhHwXksjWkorAP4MvhQ-6FAJz&_nc_ohc=UXX0wLldKTQQ7kNvgHmPgdG&_nc_zt=23&_nc_ht=scontent.fhan3-3.fna&_nc_gid=AtC0z9lZhRaPvH_OW61KHyd&oh=00_AYBWfSBh0N-IcQBvrlX8y0VdF1OI-9loD7wjq1jfCeCGsw&oe=6712DD31",
          "https://scontent.fhan4-3.fna.fbcdn.net/v/t39.30808-6/453876814_469439959193933_8458642333612467789_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeE3j1aUE-hGGUCKED0nWM54T0ylqFbf9SRPTKWoVt_1JMX4oZpIrUovdOS7jLLJ1mq-ICIOWEDLZzeIHSUSTISd&_nc_ohc=t9jdM-I6SMQQ7kNvgFivM8W&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&_nc_gid=AzLXwZrq5RuBSt1yqjKbYDL&oh=00_AYCIn3ulqmPEu2XB4yHK7leAPJR0Anih8kSRyihfjYEy4w&oe=6712BF49",
        ],
        amenities: [
          { name: "Private office", icon: <Monitor size={16} /> },
          { name: "Private meeting room", icon: <UserCheck size={16} /> },
          { name: "High security", icon: <Zap size={16} /> },
          { name: "Reception services", icon: <Building size={16} /> },
          { name: "Business address", icon: <Building size={16} /> },
        ],
      },
    },
    {
      standard: {
        title: "Event Area",
        description:
          "Event, seminar and workshop space with full sound and lighting equipment.",
        images: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTspRhxQhspNLYVaJZPh0Io1C8eYFzsykKCGQ&s",
          "https://scontent.fhan4-6.fna.fbcdn.net/v/t39.30808-6/432728315_384779387659991_4566348556855182515_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHw-oRHiEzVEMb5CJWenFArYWEgTyeTwY9hYSBPJ5PBj0WtUF72EaqfNgPz26Wkha94wN3dWBWhtXYd9-xGHRMb&_nc_ohc=S66dWbfclugQ7kNvgFQSPX-&_nc_zt=23&_nc_ht=scontent.fhan4-6.fna&_nc_gid=ABwHcNcsqoUV3scXGVZoW0q&oh=00_AYBeQAgpxx9sQPS2daiH-9uKgM5vHdYgeTaXKBpnHjHyRQ&oe=6712CD18",
          "https://scontent.fhan4-6.fna.fbcdn.net/v/t39.30808-6/432589093_384779820993281_5375435595144586931_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFR3Tsp7sdwJn6y8xGA9bSFX1zf0inR-ndfXN_SKdH6d6ekuRJf9_7k_QzKICGxaqXlC9_sBSGP2XbaMVUUCVMZ&_nc_ohc=8zgjvydSopwQ7kNvgF27RIU&_nc_zt=23&_nc_ht=scontent.fhan4-6.fna&_nc_gid=AqwOp-iABDEFf_rW-mcJp8h&oh=00_AYAAz3Mu2rUqxqXfJF4cUW-HhtypPfTNg7-J8u2UwfssHQ&oe=6712B42B",
        ],
        amenities: [
          { name: "Stage", icon: <Monitor size={16} /> },
          { name: "Sound system", icon: <UserCheck size={16} /> },
          { name: "Projector", icon: <Zap size={16} /> },
          { name: "Flexible tables and chairs", icon: <Building size={16} /> },
        ],
      },
      premium: {
        title: "Creative Zone",
        description:
          "Space for creative projects, small studio with specialized equipment.",
        images: [
          "https://scontent.fhan4-5.fna.fbcdn.net/v/t39.30808-6/449122499_445677164903546_5135898021403149141_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHopfvzP-tzO5nK4iF3Nk4cpU6WUZHD2-GlTpZRkcPb4TZ4gIJvH45B2brQOXDMhwqN2Gc21dMEXnuTKgr_V5HY&_nc_ohc=NhM_Tzltu0wQ7kNvgEvsLw_&_nc_zt=23&_nc_ht=scontent.fhan4-5.fna&_nc_gid=A58QXykQ88tdbPH1Dj5B5Ik&oh=00_AYCAlOOTgtRzsjy6cTT7Uy6xiGAd3qPWBrGDRnb67QCeKA&oe=6712B5D9",
          "https://scontent.fhan3-3.fna.fbcdn.net/v/t39.30808-6/442495270_422401860564410_5365062974683296127_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHiFl75h5Ofax4jNDbZMisSpOYrGYGvqYyk5isZga-pjMBrA6smDc2dvIfNYqVrBqFNkrBJAliz0lvo4nHtPPds&_nc_ohc=rGTXS4bS4m0Q7kNvgH-6iMF&_nc_zt=23&_nc_ht=scontent.fhan3-3.fna&_nc_gid=ALKE8_niQnd8tPi9YBANYmd&oh=00_AYAkFw4exWOSZVyPu004yQeHJO2oSGK_E_ZtOJMm9p9ScA&oe=6712D10C",
          "https://scontent.fhan3-3.fna.fbcdn.net/v/t39.30808-6/441397309_415513561253240_5140438708186131897_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEyPTKmtNd1ETu6kDvcfMS-paAb4lPKt3iloBviU8q3eKimY513Gdv_lgcVxEo-aqO997ZAI9zvqhqH9EVnI4iQ&_nc_ohc=i8kjqvT7JVIQ7kNvgHmD50M&_nc_zt=23&_nc_ht=scontent.fhan3-3.fna&_nc_gid=AjkpbtTSdRyYV1ge0s4x5zw&oh=00_AYCW7UtbwwTfYIzG1OyPPU8ja-f5kegRtzMdMfuWoLX-TA&oe=6712D689",
        ],
        amenities: [
          { name: "Filming equipment", icon: <Monitor size={16} /> },
          { name: "Recording studio", icon: <UserCheck size={16} /> },
          { name: "3D Printer", icon: <Zap size={16} /> },
          { name: "Design software", icon: <Building size={16} /> },
        ],
      },
    },
  ];

  const nextComparison = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % comparisons.length);
  };

  const prevComparison = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + comparisons.length) % comparisons.length
    );
  };

  return (
    <div className=" mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Modern workspace</h1>
        <div className="flex space-x-2">
          <button
            onClick={prevComparison}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextComparison}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      <div className="flex gap-6">
        <WorkspaceType {...comparisons[currentIndex].standard} />
        <WorkspaceType {...comparisons[currentIndex].premium} />
      </div>
    </div>
  );
};

export default WorkspaceComparison;
