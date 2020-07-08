import React from "react"
import './styles/css.css'
import './styles/scss.scss'
import './styles/less.less'

const App: React.FC = () => {
    return (
        <div className={'root root__font_roboto'}>
            <header>
                <h1>React typescript webpack config example</h1>
                <p>
                    This app was bootstrapped with <a href="https://github.com/genekomarov/webpack-preset-react-typpescript">webpack-preset-react-typescript</a><br/>
                    by Eugene Komarov <a href="email:gene.komarov@gmail.com">gene.komarov@gmail.com</a>
                </p>
            </header>
            <hr/>
            <main>
                <article>
                    <header>
                        <h2>CSS</h2>
                    </header>
                    <p>Styles for this article makes with CSS</p>
                </article>
                <hr/>
                <article className={'scss'}>
                    <header>
                        <h2><span>SCSS</span></h2>
                    </header>
                    <p>Styles for this article makes with SCSS</p>
                </article>
                <hr/>
                <article className={'less'}>
                    <header >
                        <h2><span>LESS</span></h2>
                    </header>
                    <p>Styles for this article makes with LESS</p>
                </article>
            </main>
        </div>
    )
}

export default App
