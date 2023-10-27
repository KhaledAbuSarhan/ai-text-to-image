import { useState } from "react"
import {useNavigate } from 'react-router-dom'

import {preview} from '../assets';
import {getRandomPrompt} from '../utils'
import { FormField, Loader } from "../components";

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
    apiKey: ''
  });
  const [generatingImg, SetGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false)

  const handleChange  = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({...form, prompt: randomPrompt})
  }

  const generateImage = async () => {
    if(form.prompt) {
      try {
        SetGeneratingImg(true);
        const response = await fetch(`https://text-to-image-ai-kzg6.onrender.com/api/v1/dalle`, {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json'
          },
          body : JSON.stringify({prompt: form.prompt, apiKey: form.apiKey}),
        })
        const data = await response.json();

        setForm({...form, photo: data?.url})
      } catch(error) {
        alert(error)
      } finally {
        SetGeneratingImg(false);
      }
    } else {
      alert('Please enter a prompt')
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(form?.prompt && form?.photo) {
      setLoading(true)
      try {
        const response = await fetch('https://text-to-image-ai-kzg6.onrender.com/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json'
          },
          body : JSON.stringify(form)
        })
        await response.json();
        navigate('/');
      } catch (err) {
        alert(err)
      } finally {
        setLoading(false)
      } 
    } else {
      alert('Please enter the prompt and generate an image')
    } 
  }

  return (
    <section className="max-w-7xl mx-auto">

      {/* Start Header-Text Part */}
      <div>
          <h1 className="font-extrabold text-[#222328] text-[32px]">
          Commnuity Show Case
          </h1>
          <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">
            Create imaginative and visually stunning images through DALL-E AI and share them with the community
          </p>
      </div>
      {/* End Header-Text Part */}

      {/* Start the Form to Create Images */}
      <form className="mt-16 max-w-3xl " onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
        <FormField
            labelName = "Your Openai Api Key"
            type= "text"
            name= "apiKey"
            placeholder = "43243*******"
            value = {form.apiKey}
            handleChange = {handleChange}
          />
          <FormField
            labelName = "your name"
            type= "text"
            name= "name"
            placeholder = "Jhon Doe"
            value = {form.name}
            handleChange = {handleChange}
          />
          <FormField
            labelName = "Prompt"
            type= "text"
            name= "prompt"
            placeholder = "'3D render of a cute tropical fish in an aquarium on a dark blue background, digital art'"
            value = {form.prompt}
            handleChange = {handleChange}
            isSurpriseMe
            handleSurpriseMe = {handleSurpriseMe}
          />
          <div className="relative bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
        {form.photo 
        ? (
        <img
            src={form.photo}
            alt={form.prompt}
            className="w-full object-contain"
          />
        )
        : (
        <img
            src={preview}
            alt="preview"
            className="w-9/12 h-9/12 object-contain opacity-40"
        />
        )}
        {generatingImg && (
          <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
            <Loader/>
          </div>
        )}
            </div>
        </div>

        <div className="mt-5 flex gap-5">
        <button
        type="button"
        onClick={generateImage}
        className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          {generatingImg ? 'Generating...' : 'Generate'}
        </button>
        </div>
        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">Once you have created the image you want, you can share it with others in the community</p>
          <button type="submit" className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center">
            {loading ? 'Sharing...' : 'Share with the community'}
          </button>
        </div>
      </form>
      {/* End the Form to Create Images */}
    </section>
  )
}

export default CreatePost