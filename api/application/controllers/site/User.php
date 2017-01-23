<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User extends CI_Controller {

    public function _construct()
    {
        parent::_construct();

        $post = file_get_contents('php://input');
        $_POST= json_decode($post, true);

    }

    public function get($id){
        $this->load->model('site/User_model');
        $output=$this->User_model->get($id);
        echo json_encode($output);
    }



    public  function create(){
        $this->load->model('site/User_model');

        $this->form_validation->set_error_delimiters('','');
        $this->form_validation->set_rules( 'name' , 'Imię' , 'required|min_length[3]' );
        $this->form_validation->set_rules( 'email' , 'Email' , 'required|valid_email|is_unique[users.email]' );
        $this->form_validation->set_rules( 'password' , 'Hasło' , 'required|matches[passconf]' );
        $this->form_validation->set_rules( 'passconf' , 'Powtórz hasło' , 'required|matches[password]' );


        if($this->form_validation->run()){

            $user=$this->input->post('user');
            $user['role']='user';
            unset($user['passconf']);


            $user['password']=crypt($user['password'], config_item('encryption_key'));
            $this->User_model->create($user);

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

   public function login(){
    $this->load->model('site/User_model');
       $email = $this->input->post( 'email' );
       $password = $this->input->post( 'password' );
       $password = crypt( $password , config_item( 'encryption_key' ) );

       $login = $this->User_model->login( $email , $password );

       if ( !$login )
       {
           $output['error'] = 'Błędne hasło lub email';
       }
       else
       {
           $token = $this->jwt->encode( array(
               'userId' => $login->id,
               'name' => $login->name,
               'email' => $login->email,
               'role' => $login->role
           ) , config_item( 'encryption_key' ) );

           $output['token'] = $token;
       }

       echo json_encode( $output );
   }

}
