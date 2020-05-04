import React from 'react';
import { mount } from 'enzyme';
import { create } from 'react-test-renderer';
import Footer from '../../components/Footer';

// Create the suit
describe('<Footer />', () => {
    const footer = mount(<Footer />);

    test('Render Footer Component', () => {
        expect(footer.length).toEqual(1);
    });

    test('Footer has 3 anchors', () => {
        expect(footer.find('a')).toHaveLength(3);
    });

    test('Footer Match snapshot', () => {
        const footer = create(<Footer />);
        expect(footer.toJSON()).toMatchSnapshot();
    });
});



// test('Footer has class "footer"', () => {
//     const footer = shallow(<Footer />);
//     const footerElem = footer.find('footer');
//     expect(footerElem.hasClass('footer')).toBe(true);
// });


