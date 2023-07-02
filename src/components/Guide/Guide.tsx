import { useState } from 'react';
import ReactHotkeys from 'react-hot-keys';
import { drawingStore } from '~/store/store';
import styles from './styles.module.css';

const guideText = [
  {
    name: 'general',
    title: <h3 id="general">How to use this app:</h3>,
    text: (
      <h4>
        You can create either a texture or an animation. You should choose the size of the texture
        first, then select on a switch what you want to create, animation or a texture. Animations
        are tightly bonded to a textures so you have to create a texture first. Clicking on
        "PixelMation" logo will redirect you to the home page.
      </h4>
    ),
  },
  {
    name: 'textures',
    title: <h3 id="textures">How to create texture</h3>,
    text: (
      <>
        <h4>
          To create a texture you have to choose it's size on the home page and select "texture" on
          the switch. Then click "Generate".
        </h4>
        <h4>
          You can see a field of editable cells and a bunch of buttons. If you have already created
          texture, click "Load texture" and select a file to be loaded.
        </h4>
        <h4>
          You can choose color on the square to the left and set to transparent color on click on
          "Set transparent color". You can change background color of the whole website as well.
          Default background color is #777777.
        </h4>
        <h4 className={styles['important']}>
          Right click works like an eyedropper and selects a color on the canvas.
        </h4>
        <h4 className={styles['important']}>
          Don't forget that when you'll be drawing animation, you would be able to choose colors
          only from your texture so if you plan to show colors from the back of a character or any
          other color, don't forget to include them somewhere on a texture!
        </h4>
        <h4>
          After finishing your work don't forget to save the progress! Clicking "Save and export"
          button will download .json file with your work.
        </h4>
        <h4>
          If you want, you can also save your texture as .png but don't forget to turn off grid
          before that. Otherwise this grid will also be displayed on png!
        </h4>
        <div className={styles['important']}>
          Please remember that this application is a website and each reload causes progress loss!
          Don't forget to save each time you leave your pc!
        </div>
      </>
    ),
  },
  {
    name: 'animations',
    title: <h3 id="animations">How to create animations</h3>,
    text: (
      <>
        <h4 className={styles['important']}>
          To create an animation you first need to have a texture or an animation file because
          animation cannot exist without it's texture!
        </h4>
        <h4>
          When you choose "Animation" on switch on the main page, click "Generate". You'll be taken
          to a page where you can select what to import, texture or animation.
        </h4>
        <h4>
          Loading texture will create an empty animation with a single frame that will be based on
          selected texture.
        </h4>
        <h4>
          If you select animation, it will just load saved animation and you can continue working on
          it.
        </h4>
        <h3 className={styles['important']}>Controls</h3>
        <h4>
          On the left you will see list of tools that will display selected color, allow to set an
          empty color or change background as it was for the <a href="#textures">texture</a>.
        </h4>
        <h4 className={styles['important']}>
          Please remember that when you draw an animation, you base only on a texture, so you can
          select colors only from it! If you need some more colors, you'll have to contact me on
          Discord.
        </h4>
        <h4 className={styles['important']}>
          You can switch between slides using LEFT and RIGHT arrow keys or with A D.
        </h4>
        <h4>
          You can add slides, copy current slide, insert texture as a slide and delete current
          slide.
        </h4>
        <h4>You can play your animation to see how it looks like and change it's speed.</h4>
        <div className={styles['important']}>
          Please remember that this application is a website and each reload causes progress loss!
          Don't forget to save each time you leave your pc!
        </div>
      </>
    ),
  },
];

export const Guide = () => {
  const [isOpened, setIsOpened] = useState(false);
  const bgColor = drawingStore((state) => state.bgColor);

  return (
    <ReactHotkeys keyName="esc" onKeyDown={() => setIsOpened(false)}>
      <div
        className={`${styles['container']} ${isOpened ? styles['open'] : ''}`}
        style={{
          background: bgColor,
        }}
      >
        <div className={styles['trigger']} onClick={() => setIsOpened(!isOpened)}>
          {isOpened ? 'Close' : 'Open'} guides
        </div>
        <div className={styles['content']}>
          <h2>Welcome to PixelMation!</h2>
          <section>
            <p>
              It's an app that helps you to create pixel textures and animations! Text that you are
              reading now is a guide for that application. It will always be here and you can open
              it any time!
            </p>
          </section>
          <section>
            <h4>
              Here's a list of topics you might be interested in:
              <ul className={styles['sections-list']}>
                {guideText.map((el, id) => (
                  <a href={`#${el.name}`} key={id}>
                    {el.name}
                  </a>
                ))}
              </ul>
            </h4>
          </section>
          {guideText.map((el, key) => (
            <section key={key}>
              {el.title}
              {el.text}
            </section>
          ))}
        </div>
      </div>
    </ReactHotkeys>
  );
};
