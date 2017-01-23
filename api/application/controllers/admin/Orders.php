<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Orders extends CI_Controller {

    public function _construct()
    {
        parent::_construct();

        $post = file_get_contents('php://input');
        $_POST= json_decode($post, true);

    }


    public function get(){
        $this->load->model('admin/Orders_model');
        $token=$this->input->post('token');
        $token =$this->jwt->decode($token, config_item('encryption_key'));

        if($token->role!='admin')
            exit('Nie jesteś adminem');


        $output=$this->Orders_model->get();
        echo json_encode($output);


    }

    public function update(){
        $this->load->model('admin/Orders_model');

        $token=$this->input->post('token');
        $token =$this->jwt->decode($token, config_item('encryption_key'));
        if($token->role!='admin')
            exit('Nie jesteś adminem');

        $id=$this->input->post('id');
        $data['status']=$this->input->post('status');
        $this->Orders_model->update($id,$data );
    }

    public function delete(){
        $this->load->model('admin/Orders_model');

        $token=$this->input->post('token');
        $token =$this->jwt->decode($token, config_item('encryption_key'));
        if($token->role!='admin')
            exit('Nie jesteś adminem');

        $id=$this->input->post('id');
        $this->Orders_model->delete($id);
    }


}




