import React from 'react';
import { create } from 'react-test-renderer';
import { render, shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Footer from '../Footer';

configure({ adapter: new Adapter() });

describe('Footer testing', () => {
    test('Match snapshot', () => {
        const footer = create(<Footer />);
        expect(footer.toJSON()).toMatchSnapshot();
    });

    test('Footer has class "footer"', () => {
        const footer = shallow(<Footer />);
        const footerElem = footer.find('footer');
        expect(footerElem.hasClass('footer')).toBe(true);
    });

    test('Footer has 3 anchors', () => {
        const footer = render(<Footer />);
        expect(footer.find('a')).toHaveLength(3);
    });
});