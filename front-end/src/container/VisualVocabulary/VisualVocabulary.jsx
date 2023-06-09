import React, {useState, useEffect} from 'react'
import "./VisualVocabulary.scss";
import {motion} from 'framer-motion';
import {AppWrap, MotionWrap} from '../../wrapper';
import { client, urlFor } from '../../client.js';
import {AiFillPlusCircle} from 'react-icons/ai';
import toast, { Toaster } from 'react-hot-toast';
import {RiDeleteBack2Fill} from 'react-icons/ri';

const VisualVocabulary = () => {

  const [isShowVisualVocabForm, setShowVisualVocabForm] = useState(false);
  const [visualVocabs, setVisualVocabs] = useState([]);
  
  //adding new word
  const handleChangeInput = async (event) => {

    const file = event.target.files[0];//file

    // Upload the image
    const image = await uploadImage(file);

    // Create a document with the uploaded image
    await handleAddVisualVocab(image);
  }//handleChangeInput

  /*
    uploadImage takes a file as input, uploads it to Sanity using client.assets.upload, 
    and returns the image reference in the required format.
  */
   const uploadImage = async (file) => {
    const imageData = await client.assets.upload('image', file);

    return {
      _type: 'visualVocabs',
      asset: {
        _ref: imageData._id,
        _type: 'reference'
      }
    };
  }//uploadImage

  /*
    handleAddVisualVocab takes an image reference as input, 
    creates a new document with the image field, and creates the document in Sanity using client.create.
  */
  const handleAddVisualVocab = async (imageUrl) => {
    const visualVocabsDoc = {
      _type: 'visualVocabs',
      imageUrl : imageUrl,  // Assign the image reference obtained from uploadImage()
    };

    // Create the document in Sanity
    await client.create(visualVocabsDoc);

    toast.success('Successfully uploaded!');
    setShowVisualVocabForm(false);//hide VisualVocabulary form after submission of new word
    window.location.reload();
  }//handleAddVisualVocab

  //delete VisualVocabulary
  const handleDelete = (index, _id) => {
    client.delete({query: `*[_type == "visualVocabs"][${index}]`})
    .then(() => {
      toast.success('Successfully deleted!'); 
      window.location.reload();
    })
    .catch((err) => {
      console.error('Delete failed: ', err.message)
    });
  }//handleDelete

  //fetching visual vocabs data from sanity
  useEffect(() => {
    const query = `*[_type == "visualVocabs"]`;

    client.fetch(query).then((data) => {
      setVisualVocabs(data);
    });
  }, []);

  return (
    <>
      <h2 className='head-text'>Visual Vocabulary
        {
          //show VisualVocabulary form after clicking on the add icon +
        }
          <AiFillPlusCircle onClick={() => setShowVisualVocabForm(true)}/>
      </h2>
      <p className='p-text'>In this section you can do practice visual vocabulary.</p>
      <p className='p-text'>Read as much as possible. If you come across a word you don't know, add it down or look it up.</p>

      {/* Add new VisualVocabulary starts here */}
      {
        isShowVisualVocabForm ? (
          <div className='app__visualVocab-form app__flex'>
            <div className='app__flex'>
              <h3>Add Visual Vocabulary</h3>
            </div>
            <div className='app__flex'>
              <input type="file" name="imageUrl" onChange={handleChangeInput} />
            </div>
          </div>
        )
        :
        (
          <div>
            
          </div>
        )
      }
      {/* Add new VisualVocabulary ends here */}
      
      {/* displaying visual vocabs items starts here */}
      <div className='app__visualVocab-items'>
          {/* VisualVocabulary item card */}
          {
            visualVocabs.map((visualVocab, index) => (
              <motion.div whileInView={{opacity:1}}
              whileHover={{ scale: 1.1 }}
              transition= {{ duration: 0.5, type : 'tween'}}
              className='app__visualVocab-item'
              key={index}
              > 
                <h4>
                  <RiDeleteBack2Fill onClick={() => handleDelete(index, visualVocab._id)}/>
                  &nbsp;&nbsp;
                </h4>
                <img src={urlFor(visualVocab.imageUrl)}/>
              </motion.div>
             ))
          }
          <div>
            <Toaster
              position="top-center"
              reverseOrder={false}
            />
          </div>
      </div>
      {/* displaying visual vocabs items ends here */}
    </>
  )
}

//AppWrap - Component, idName, className(parameters)
//MotionWrap - Component, className(parameters)
export default AppWrap(MotionWrap(VisualVocabulary, 'app__visualVocabs'), //component 
"visualvocabulary", //idName
"app__primarybg" //className for bg color
); 
