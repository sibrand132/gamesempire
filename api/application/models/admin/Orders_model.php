<?php

class Orders_model extends CI_Model{

    public function get(){
        $q=$this->db->get('orders');
        $q=$q->result();
        return $q;
    }

    public function create($orders){
        $this->db->insert('orders', $orders);


    }

    public function update($id,$data){
        $this->db->where('id', $id);
        $this->db->update('orders', $data);
    }

    public function delete($id){
        $this->db->where('id', $id);
        $this->db->delete('orders');
    }



}