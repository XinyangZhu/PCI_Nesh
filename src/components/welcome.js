import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Styled from 'styled-components';

const Button = Styled.button`
	border-radius: 3px;
	padding: 0.25em 1em;
	background: ${props => props.primary ? '#f4e141' : 'transparent'};
	color: ${props => props.primary ? 'white' : '#3e668a'};
	border: 2px solid #f4e141;
	font-size: ${props => props.primary ? '1em' : '1.2em'};
	cursor: pointer;
`;

class Welcome extends Component {
	constructor(props) {
		super(props);
	}

	render() {

		return (
			<div>
				<h1 className="cover-heading">Public Company Insights</h1>
    			<p className="lead">Gain insights about your target companies. </p>
				<Button primary onClick = {() => this.props.switchPage(1)}>Start Now</Button>
			</div>
		);
	}
}

export default Welcome;