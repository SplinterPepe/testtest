import { Form, Button, Modal } from 'react-bootstrap'
import { Formik, FormikHelpers } from 'formik'
import * as yup from 'yup'
import { useMask } from '@react-input/mask'
import { useDispatch, useSelector } from 'react-redux'
import { addUser, selectUsers } from '../users/usersSlice'
import { selectIsCreateUserModalOpen, toggleCreateUserModal } from './modalsSlice'

interface CreateUserFormValues {
    name: string
    username: string
    email: string
    phone: string
    zipcode: string
}

export const CreateUserModal = () => {

    const users = useSelector(selectUsers)
    const dispatch = useDispatch()

    const phoneRegExp = /7\s\(\d\d\d\)\s\d\d\d-\d\d-\d\d/

    const schema = yup.object().shape({
        name: yup.string().required('Обязательное поле'),
        username: yup.string().required('Обязательное поле'),
        email: yup.string().email('Не корректный Email').required('Обязательное поле'),
        phone: yup.string().matches(phoneRegExp, 'Не корректный телефон').required('Обязательное поле'),
        zipcode: yup.string()
    })

    const inputRef = useMask({
        mask: '+7 (___) ___-__-__',
        replacement: { _: /\d/ },
    })

    return (
        <Modal show={useSelector(selectIsCreateUserModalOpen)}>
            <Modal.Header>
                <Modal.Title>Добавить пользователя</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{
                        name: '',
                        username: '',
                        email: '',
                        phone: '',
                        zipcode: ''
                    }}
                    onSubmit={(
                        values: CreateUserFormValues,
                        { setSubmitting }: FormikHelpers<CreateUserFormValues>
                    ) => {
                        let nextUserId = 1
                        if (typeof users[users.length - 1] !== 'undefined') {
                            nextUserId = users[users.length - 1].id + 1
                        }
                        dispatch(addUser({
                            id: nextUserId,
                            name: values.name,
                            username: values.username,
                            email: values.email,
                            phone: values.phone,
                            address: { zipcode: values.zipcode }
                        }))
                        dispatch(toggleCreateUserModal())
                    }}
                    validateOnChange={false}
                    validateOnBlur={false}
                    validationSchema={schema}
                >
                    {({ handleSubmit, isSubmitting, handleChange, values, touched, errors }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Имя<span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    type='text'
                                    name='name'
                                    placeholder='Имя...'
                                    value={values.name}
                                    onChange={handleChange}
                                    isValid={touched.name && !errors.name}
                                    isInvalid={!!errors.name}
                                />
                                {errors.name && touched.name && <div>{errors.name}</div>}
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Имя пользователя<span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    type='text'
                                    name='username'
                                    placeholder='Имя пользователя...'
                                    value={values.username}
                                    onChange={handleChange}
                                    isValid={touched.name && !errors.username}
                                    isInvalid={!!errors.username}
                                />
                                {errors.username && touched.username && <div>{errors.username}</div>}
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Email<span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    type='text'
                                    name='email'
                                    placeholder='Email...'
                                    value={values.email}
                                    onChange={handleChange}
                                    isValid={touched.email && !errors.email}
                                    isInvalid={!!errors.email}
                                />
                                {errors.email && touched.email && <div>{errors.email}</div>}
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Телефон<span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    type='text'
                                    name='phone'
                                    placeholder='+7 (___) ___-__-__'
                                    value={values.phone}
                                    onChange={handleChange}
                                    isValid={touched.phone && !errors.phone}
                                    isInvalid={!!errors.phone}
                                    ref={inputRef}
                                />
                                {errors.phone && touched.phone && <div>{errors.phone}</div>}
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Почтовый индекс</Form.Label>
                                <Form.Control
                                    type='text'
                                    name='zipcode'
                                    placeholder='Почтовый индекс...'
                                    value={values.zipcode}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => dispatch(toggleCreateUserModal())}>Отмена</Button>
                                <Button variant="primary" type="submit">Создать</Button>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    )
}