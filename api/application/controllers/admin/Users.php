<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Users extends CI_Controller {

    public function _construct()
    {
        parent::_construct();

        $post = file_get_contents('php://input');
        $_POST= json_decode($post, true);


    }

    public function get($id=false){
        $this->load->model('admin/Users_model');
        $token=$this->input->post('token');
        $token =$this->jwt->decode($token, config_item('encryption_key'));
        if($token->role!='admin')
            exit('Nie jesteś adminem');

        $output=$this->Users_model->get($id);
        echo json_encode($output);
    }


    public function update(){
        $this->load->model('admin/Users_model');
        $token=$this->input->post('token');
        $token =$this->jwt->decode($token, config_item('encryption_key'));

        if($token->role!='admin')
            exit('Nie jesteś adminem');

        $this->form_validation->set_error_delimiters('','');
        $this->form_validation->set_rules( 'name' , 'Imię' , 'required|min_length[3]' );
        $this->form_validation->set_rules( 'email' , 'Email' , 'required|valid_email|callback_unique_email' );
        $this->form_validation->set_rules( 'password' , 'Nowe hasło' , 'matches[passconf]' );
        $this->form_validation->set_rules( 'passconf' , 'Powtórz nowe hasło' , 'matches[password]' );


        if($this->form_validation->run()){

            $user=$this->input->post('user');

            $user['password']=crypt($user['password'], config_item('encryption_key'));

            $this->Users_model->update($user);

        }
        else{
            $errors['name']=form_error('name');
            $errors['email']=form_error('email');
            $errors['password']=form_error('password');
            $errors['passconf']=form_error('passconf');

            // $errors['name'] = form_error( 'name' );
            echo json_encode($errors);

        }
    }

    function unique_email(){
        $this->load->model('admin/Users_model');
        $id = $this->input->post( 'id' );
        $email = $this->input->post( 'email' );

        if ( $this->Users_model->get_unique( $id , $email ) )
        {
            $this->form_validation->set_message( 'unique_email' , 'Inny użytkownik ma taki adres e-mail' );
            return false;
        }

        return true;
    }

    public  function create(){
        $this->load->model('admin/Users_model');
        $token=$this->input->post('token');
        $token =$this->jwt->decode($token, config_item('encryption_key'));

        if($token->role!='admin')
            exit('Nie jesteś adminem');

        $this->form_validation->set_error_delimiters('','');
        $this->form_validation->set_rules( 'name' , 'Imię' , 'required|min_length[3]' );
        $this->form_validation->set_rules( 'email' , 'Email' , 'required|valid_email|is_unique[users.email]' );
        $this->form_validation->set_rules( 'password' , 'Hasło' , 'required|matches[passconf]' );
        $this->form_validation->set_rules( 'passconf' , 'Powtórz hasło' , 'required|matches[password]' );


        if($this->form_validation->run()){

            $user=$this->input->post('user');
            $this->Users_model->create($user);

        }
        else{
            $errors['name']=form_error('name');
            $errors['email']=form_error('email');
            $errors['password']=form_error('password');

           // $errors['name'] = form_error( 'name' );
            echo json_encode($errors);

        }



    }

    public function delete(){
        $this->load->model('admin/Users_model');
        $token=$this->input->post('token');
        $token =$this->jwt->decode($token, config_item('encryption_key'));

        if($token->role!='admin')
            exit('Nie jesteś adminem');

        $user=$this->input->post('user');
        $this->Users_model->delete($user);
    }

}
