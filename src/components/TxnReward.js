import React, { Component } from 'react'
import { Table } from 'antd'
import TxnTag from '../components/TxnTag'

const columns = [
  {
    title: 'Account',
    dataIndex: 'account',
    key: 'account',
    render: (data) => <a href={'/accounts/' + data}>{data}</a>,
  },
  {
    title: 'Rewards',
    dataIndex: 'count',
    key: 'count',
  },
  {
    title: 'Total HNT',
    dataIndex: 'amount',
    key: 'amount',
    render: (data) => <span>{data.toLocaleString()}</span>,
  },
]

class TxnReward extends Component {
  state = {
    groupedRewards: [],
  }

  componentDidMount() {
    const { txn } = this.props
    const { groupedRewards } = this.state
    txn.rewards.map((r) => {
      const val = { account: r.account }
      val['rewards'] = txn.rewards.filter((obj) => {
        return obj.account === r.account
      })
      if (
        groupedRewards.filter((e) => e.account === val.account).length === 0
      ) {
        val['count'] = val.rewards.length
        let amount = 0
        val.rewards.map((r) => {
          amount += r.amount.integerBalance / 100000000
        })
        val['amount'] = amount
        groupedRewards.push(val)
      }
    })
    groupedRewards.sort((b, a) =>
      a.amount > b.amount ? 1 : b.amount > a.amount ? -1 : 0,
    )
    this.setState({ groupedRewards: [...groupedRewards] })
  }

  render() {
    const { txn } = this.props
    const { groupedRewards } = this.state

    return (
      <div>
        <div style={{ padding: '0 24px 50px' }}>
          <h3 style={{ color: '#444' }}>About Mining Reward Transactions</h3>
          <p>
            Bundles multiple reward transactions at the end of each epoch and
            distributes all HNT produced in that block to wallets that have
            earned them.{' '}
          </p>
        </div>
        <Table
          dataSource={groupedRewards}
          columns={columns}
          size="small"
          rowKey="account"
          pagination={{ pageSize: 50 }}
          scroll={{ x: true }}
          /*expandable={{
            expandedRowRender: record => <p style={{ margin: 0 }}>{record.rewards}</p>,
          }}*/
        />
      </div>
    )
  }
}

export default TxnReward
