import { useState } from "react";

export default function ImageSlider(props){

    const images = props.images;
    console.log(props)

    const [activeImage,setActiveimg] = useState(images[0])

    return(

        <div className="w-full h-full flex justify-center items-center">
            <div className="bg-green-400 w-[70%] aspect-square relative ">
                <img src={activeImage} className="w-full h-full object-cover" />
                <div className="h-[100px] w-full absolute bottom-0 left-0 flex justify-center items-center backdrop-blur-3xl">
                    {
                        images.map(
                            (image,index)=>{
                                return (
                                    <img key={index} src={image} className="h-full aspect-auto mx-[5px] cursor-pointer" onClick={
                                        () =>{
                                           setActiveimg(image) 
                                        }
                                    } />
                                )
                                
                            }
                        )
                    }

                </div>
            </div>

        </div>



    )

}