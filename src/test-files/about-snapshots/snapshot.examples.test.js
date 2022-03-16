// Advantages of using Jest snapshot testing: Jest snapshot test can be written faster than traditional ones:
import React from 'react';
import { mount, configure } from 'enzyme';
// import Adapter from "enzyme-adapter-react-16";
import UsersComponent from '../../components/about-snapshots/users-component';
import { render, screen } from '@testing-library/react';
// let Enzyme = require('enzyme')
// let Adapter = require('react')

const data = [
    {
        id: '5c76f0b7bb5c210da0f8554a',
        firstName: 'Florine',
        lastName: 'Russell',
        email: 'florine.russell$email..org',
    },
];

// Enzyme.configure({ adapter: new Adapter() })

describe('Y=Users component', () => {
    // snapshot way
    it('it renders list with one row', async () => {
        let fetchUsersLists = jest.fn(() => new Promise(res => res(data)))
        // let wrapper = mount(<div>{... fetchUsersLists}</div>)
        // let wrapper = mount(render(<div>{fetchUsersLists?.id}</div>))
        // let wrapper = mount(<div>{fetchUsersLists?.id}</div>)
        // let wrapper = mount(<UsersComponent fetchUsersList={fetchUsersLists} />)
        let wrapper = render(<UsersComponent fetchUsersList={fetchUsersLists} />)
        
        // wrapper.update()

        expect(wrapper).toMatchSnapshot()
    })

    // traditional way
    it('renders list with one row without snapshot', async () => {
        const fetchUsersLists = jest.fn(() => new Promise(resolve => resolve(data)));
        // const wrapper = mount(<UsersComponent fetchUsersList={fetchUsersList}/>);
        let wrapper = render(<UsersComponent fetchUsersList={fetchUsersLists} />)
    
        // wrapper.update();
    
        // expect(wrapper.find('h1').length).toBe(1);
        expect(screen.getByText('aa')).toHaveTextContent('aa');
        // expect(wrapper.find('h1').text()).toBe('List of 8 users');
    
        // expect(wrapper.find('button').length).toBe(1);
        // expect(wrapper.find('button').text()).toBe('add new user');
    
        // expect(wrapper.find('ul').children().length).toBe(8);
    })
})