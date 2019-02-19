import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Welcome_wrapper from './components/welcome'
import Search_wrapper from './components/search'
import Info_wrapper from './components/info'

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {activePage: 0, ticker: ""};
		this.switchPage = this.switchPage.bind(this);
		this.setTicker = this.setTicker.bind(this);
		// this.getInfo = this.getInfo.bind(this);
	}

	switchPage(num) {
		if (num == 2) {
			document.getElementById("menulink").style["display"] = "block"
		} else {
			document.getElementById("menulink").style["display"] = "none"
		}
		this.setState({activePage: num});
	}

	setTicker(ticker) {
		this.switchPage(2);
		this.setState({ticker: ticker});

	}

	// getInfo(ticker) {
	// 	console.log(document.getElementById('templates_info').innerHTML);
	// }

  render() {
    return (
        
      <div className="cover-container d-flex w-100 h-auto mh-100 p-3 mx-auto flex-column">
			  <header className="masthead mb-auto">
			    <div className="inner">
			      <h3 className="masthead-brand"><img style={{maxWidth: '80px'}} src="http://hellonesh.io/static/images/nesh.png"/></h3>
			      <nav style={{cursor: 'pointer'}} className="nav nav-masthead justify-content-center">
			        <a id="menulink" className="nav-link" style={{color: 'grey', display: 'none'}} onClick={() => this.switchPage(1)}>Return to search bar</a>
			      </nav>
			    </div>
			  </header>

			  <main role="main" className="inner cover">
			    
			  	<div style={{display: (this.state.activePage === 0) ? 'block' : 'none'}}>
						<Welcome_wrapper switchPage = {this.switchPage.bind(this)} id='welcome_wrapper'></Welcome_wrapper>
					</div>

					<div style={{display: (this.state.activePage === 1) ? 'block' : 'none'}}>
						<Search_wrapper setTicker = {this.setTicker.bind(this)} switchPage = {this.switchPage.bind(this)} id='search_wrapper'></Search_wrapper>
					</div>

					<div style={{display: (this.state.activePage === 2) ? 'block' : 'none'}}>
						<Info_wrapper ticker = {this.state.ticker} switchPage = {this.switchPage.bind(this)} id='info_wrapper'></Info_wrapper>
					</div>


			  </main>

			  <footer className="mastfoot mt-auto">
			    <div className="inner">
			      <p>The Path to Internship Project</p>
			    </div>
			  </footer>
			</div>
    );
  }
}

export default App;
