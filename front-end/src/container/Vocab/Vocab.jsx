import React, {useState, useEffect} from 'react'
import "./Vocab.scss";
import {motion} from 'framer-motion';
import {AppWrap, MotionWrap} from '../../wrapper';
import { client } from '../../client.js';

const Vocab = () => {

  const [vocabs, setVocabs] = useState([]);

  //fetching vocabs data from sanity
  useEffect(() => {
    const query = `*[_type == "vocabs"]`;

    client.fetch(query).then((data) => {
      setVocabs(data);
    });
  }, []);

  return (
    <>
      <h2 className='head-text'>Vocabulary</h2>
      <p className='p-text'>In this section you can do practice vocabulary.</p>
      <p className='p-text'>Read as much as possible. If you come across a word you don't know, add it down or look it up.</p>
      {/*adding vocabs*/}
      <div className='app__vocab-form app__flex'>
          <div className='app__flex'>
            <input className="p-text" type="text" placeholder="Please, enter a word" name="word" value={word} onChange={handleChangeInput} />
          </div>
          <div className='app__flex'>
            <input className="p-text" type="text" placeholder="Please, enter a meaning" name="meaning" value={meaning} onChange={handleChangeInput} />
          </div>
          <div className='app__flex'>
            <input className="p-text" type="text" placeholder="Please, enter a sentence" name="sentence" value={sentence} onChange={handleChangeInput} />
          </div>
      </div>

      {/*displaying vocabs items*/}
      <div className='app__vocab-items'>
          {/* vocab item card */}
          {
            vocabs.map((vocab, index) => (
              <motion.div whileInView={{opacity:1}}
              whileHover={{ scale: 1.1 }}
              transition= {{ duration: 0.5, type : 'tween'}}
              className='app__vocab-item'
              key={vocab.title + index}
              > 
                <h4>{vocab.word} : {vocab.meaning}</h4>
                <p>{vocab.sentence}</p>
              </motion.div>
             ))
          }
      </div>
    </>
  )
}

//AppWrap - Component, idName, className(parameters)
//MotionWrap - Component, className(parameters)
export default AppWrap(MotionWrap(Vocab, 'app__vocab'), //component 
"vocab", //idName
"app__whitebg" //className for bg color
); 
