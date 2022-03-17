// Advantages of using Jest snapshot testing: Jest snapshot test can be written faster than traditional ones:
import React from 'react';
// import { mount, configure } from 'enzyme';
// import Adapter from "enzyme-adapter-react-16";
import UsersComponent from '../../components/about-snapshots/users-component';
import { render, screen } from '@testing-library/react';
import UsersList from '../../components/about-snapshots/users-list';
// import shallow from 'enzyme/build/shallow';
// let Enzyme = require('enzyme')
// let Adapter = require('react')
import ShallowRenderer from 'react-test-renderer/shallow'

const data = [
    {
        id: '5c76f0b7bb5c210da0f8554a',
        firstName: 'Florine',
        lastName: 'Russell',
        email: 'florine.russell$email..org',
    },
];

// Enzyme.configure({ adapter: new Adapter() })

describe('Users component', () => {
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
        // expect(screen.findByRole('h1')).toBe(true)
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('aa')

        // expect(screen.getByRole('heading', {level: 1})).toHaveValue('aa')
        expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)

        expect(screen.getByRole('button').textContent).toBe('add new user')
        expect(screen.getByRole('list')).toHaveTextContent('bb')
    })
})
// In a snapshot, you exactly know what is in the header, in the button and in the list. Also, you don’t have to check it manually step by step
// Next advantage of Jest snapshot testing is that you don’t have to change your test when you update the components. It’s because Jest updates the snapshot for you once you agree for that

// Jest Snapshot tests check if your component behaves correctly: It helps you check if the passed data is properly reflected in the component or node tree:
// You’re able to combine elements from the traditional way of testing like mocking functions which are passed as props
// You can check if component called it as you expected
// For example: if you want to check whether your component called the fetch function properly
// It renders information about the fact that it’s fetching the data from the API
describe('check component behaves correctly with async', () => {
    it('calling and updating asynchronously', async () => {
        const fetchUsersLists = jest.fn(() => new Promise(resolve => resolve(data)));
        let wrapper = render(<UsersComponent fetchUsersList={fetchUsersLists} />)

        // await expect(fetchUsersLists).toHaveBeenCalled()

        expect(wrapper).toMatchSnapshot()
    })
})

// Jest snapshot allows conditional rendering tests:
// Our applications are built in a way that certain data or functionalities are visible and accessible for users according to their permissions, roles etc
// After receiving backend data, sometimes you need to check if a key value (i.e.: name or surname) is present (if not – you may want to display a placeholder)
// It can be checked with snapshots. You are able to see the results in the snapshot file
describe('users list row compoent', () => {
    it('renders row with full user data', () => {
        let wrapper = render(<UsersComponent fetchUsersList={data} />)
        expect(wrapper).toMatchSnapshot()
    })

    it('renders with placehoolder data', () => {
        let {email, user} = {...data[0]}
        let wrapper = render(<div>{email} {user ? user : 'placeholder user'}</div>)
        expect(wrapper).toMatchSnapshot()
    })
})

// Disadvantages of using Jest snapshot testing:
// There are some problems with larger snapshots: Snapshots are efficient, but only when they are small and everyone can read them from the top to the bottom
// we can use the eslint plugin which is named `no-large-snapshots`. It allows you to set the limit of lines in the snapshot files, so you can easily find components which can be split into smaller ones or you should rethink your tests which use snapshots
// In almost all cases, components which are used to build a bigger part of an application has own test so you don’t have to write tests twice
// The important part, in this case, is that you should check if the props (if required) are passed properly to the component that you used
// You can achieve it by mocking the component or use shallow render. 
// However, it’s worth remembering that mocking a few components may be confusing at times and can lead to some new problems
describe('dealing with users lists', () => {
    it('renders list', () => {
        let wrapper = render(<UsersList users={data} />)
        expect(wrapper).toMatchSnapshot()
    })

    it('using a shallow render', () => {
        let renderer = new ShallowRenderer()
        let wrapper = renderer.render(<UsersList users={data} />)

        // let wrapper = shallow(<UsersList users={data} />)
        expect(wrapper).toMatchSnapshot()
    })
})
// Oops… if you notice snapshot fle something went wrong because the snapshot file is even longer than before. So in this situation, you should check UsersList component
// This is the case where snapshot helps to find places where you can split the component into smaller parts

// The second solution for solving the problem of large snapshots is mocking selected component with custom implementation without changing the render method
// lets change the render method from shallow to render and leaving the extracted row component
// Also, created a mock for `UsersListRow` component and then updated snapshots
// jest.mock('D:/git-workspace/using-jest-with-react/src/components/about-snapshots/users-list.js', () => ({
//     UsersListRow: props => <li>{JSON.stringify(props, null, 2)}</li>
// }))
describe('users list with mock', () => {
    it('renders list per row', () => {
        let wrapper = render(<UsersList users={data} />)
        expect(wrapper).toMatchSnapshot()
    })
})

// Useful tips for using Jest snapshot testing
// It’s good to avoid ‘renders correctly’ snapshots: you should avoid naming it `renders correctly`: this name doesn’t say anything about the purpose of this particular test
// You should always control your work
    // double-check if the changes are good and if they work as you expected. Before you update a snapshot
    // you should check if all the changes are desired after code modification

// Summary:
// Snapshots can simplify your work and provide details about the code that you created
// They also can be the documentation of the components you’ve used
// Also, they can point out the spots where your application probably could be better when the snapshot is too big
// However, you shouldn’t treat them like a substitute for other approaches for testing components
// we should always try to solve problems that we meet and think about the source of them – it makes us better developers