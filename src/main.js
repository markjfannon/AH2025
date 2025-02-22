import './style.css'
import javascriptLogo from './assets/javascript.svg'
import viteLogo from '/vite.svg'
import alley from './assets/alley.png'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
<body class="scroll">
        <div id="container">

            <div id="header">
                <h1 class="title">⋆⭒˚.⋆୨୧ Meow Jam ୨୧⋆.˚⭒⋆</h1>
            </div>

            <div id="wrapper">
                <div id="two-boxes">

                    <div class="box-one scroll">

                       <div class="section-title"> MEOW!!!!</div>

                       <div class="content">
                          <p>this is the sidebar!!1!</p>
                       </div>

                    </div> 

                    <div class="box-two scroll">
                        <div class="section-title"> MEOW!!!!</div>

                        <div class="content">
                            <p>this is the other stuff!!1!</p>
                         </div>

                    </div>

                </div>
            </div>

            <div id="footer">
                <p>❤ Made with love by Lana, Alice, Mark, and Peter ❤</p>
            </div>
        </div>
   </body>
`

setupCounter(document.querySelector('#counter'))
